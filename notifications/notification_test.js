/*eslint no-console: "off"*/

const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const subscriptionsResource = testedResource + '/subscriptions/';

const accumulatorEndpoint = require('../common.js').accEndpoint;
const accumulatorResource = accumulatorEndpoint + '/dump';
const clearAccumulatorResource =  accumulatorEndpoint + '/clear';

const notifyEndpoint = require('../common.js').notifyEndpoint;

const sleep =  require('../common.js').sleep;
const spawn =  require('../common.js').spawn;


// Creates a new subscription
async function createSubscription(subscription) {
  const response = await http.post(subscriptionsResource, subscription);
  
  expect(response.response).toHaveProperty('statusCode', 201);
}

// Deletes a subscription
async function deleteSubscription(subscriptionId) {
  const response = await http.delete(subscriptionsResource + subscriptionId);
  
  expect(response.response).toHaveProperty('statusCode', 204);
}

// Updates an attribute so that a new notification shall be triggered
async function updateAttribute(entityId, propertyName, newValue) {
  const overwrittenAttrs = {
  };
    
  overwrittenAttrs[propertyName] = {
    'type': 'Property',
    'value': newValue
  };
    
  const response = await http.post(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    
  expect(response.response).toHaveProperty('statusCode', 204);
}


describe('Basic Notification. JSON', () => {
   // An entity is created
  const entity = {
    'id': 'urn:ngsi-ld:Vehicle:V1234',
    'type': 'Vehicle',
    'speed': {
      'type': 'Property',
      'value': 34
    },
    'brandName': {
      'type': 'Property',
      'value': 'Mercedes'
    }
  };

  const entityId = entity.id;
   
  let childProcess;
  
  // Accumulator is cleared before each test
  beforeEach(() => {
    return http.post(clearAccumulatorResource);
  });
  
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      spawn('node', [__dirname + '/' + 'accumulator.js']).then((pchildProcess) => {
        childProcess = pchildProcess;
        
        childProcess.on('close', (code) => {
          if (code !== null) {
            console.error(`Accumulator process exited with code ${code}`);
          }
          else {
            console.log('Accumulator process finished properly');
          }
        });
        childProcess.on('error', () => {
          console.error('Failed to start accumulator.');
        });
      
        http.post(entitiesResource, entity).then(resolve, reject);
      });
    });
  });

  
  afterAll(() => {
    childProcess.kill();
    
    const requests = [];
      
    requests.push(http.delete(entitiesResource + entityId));
    requests.push(http.post(clearAccumulatorResource));
    
    return Promise.all(requests);
  });
    
   
  it('should send a notification. Subscription to Entity Type. Any attribute', async function() {
     // A Subscription is created
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
      'type': 'Subscription',
      'entities': [
        {
          'type': 'Vehicle'
        }
      ],
      'notification': {
        'endpoint': {
          'uri': notifyEndpoint,
          'accept': 'application/json'
        }
      }
    };
    
    // Once subscription is created the first notification should be received
    await createSubscription(subscription);
    
    await sleep(2000);
    
    const checkResponse = await http.get(accumulatorResource);
    
    // Only one notification corresponding to the initial subscription
    expect(checkResponse.response.body[entityId].length).toBe(1);
    expect(checkResponse.response.body[entityId][0].speed.value).toBe(entity.speed.value);
    
    await deleteSubscription(subscription.id);
  });

  
  it('should not send a notification. Subscription to specific attribute. Update other', async function() {
     // A Subscription is created
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
      'type': 'Subscription',
      'entities': [
        {
          'type': 'Vehicle'
        }
      ],
      'watchedAttributes': ['speed'],
      'notification': {
        'endpoint': {
          'uri': notifyEndpoint,
          'accept': 'application/json'
        }
      }
    };
    
    // Once subscription is created the first notification should be received
    await createSubscription(subscription);
     
    // Now the brandName property is modified
    // No additional notification should be received
    await updateAttribute(entityId, 'brandName', 'Volvo');
    
    await sleep(2000);
    
    const checkResponse = await http.get(accumulatorResource);
    
    // Only one notification corresponding to the initial subscription shall be present
    expect(checkResponse.response.body[entityId].length).toBe(1);
    
    await deleteSubscription(subscription.id);
  });
  
  
  it('should send a notification. Simple subscription to concrete attribute', async function() {
     // A Subscription is created
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
      'type': 'Subscription',
      'entities': [
        {
          'type': 'Vehicle'
        }
      ],
      'watchedAttributes': ['speed'],
      'notification': {
        'endpoint': {
          'uri': notifyEndpoint,
          'accept': 'application/json'
        }
      }
    };
    
    // Once subscription is created the first notification should be received
    await createSubscription(subscription);
    
    // Now the speed property is modified
    // An additional notification should be received
    const newSpeed = 5;
    await updateAttribute(entityId, 'speed', newSpeed);
    
    await sleep(2000);
    const checkResponse = await http.get(accumulatorResource);
    
    // Only one notification corresponding to the subscription
    expect(checkResponse.response.body[entityId].length).toBe(2);
    expect(checkResponse.response.body[entityId][1].speed.value).toBe(newSpeed);
    
    await deleteSubscription(subscription.id);
  });


  it('should send a notification. Subscription to one attribute with filter query', async function() {
    // Speed is updated so that the initial notification will not be received
    await updateAttribute(entityId, 'speed', 10);
   
     // A Subscription is created
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
      'type': 'Subscription',
      'entities': [
        {
          'type': 'Vehicle'
        }
      ],
      'q': 'speed>80',
      'notification': {
        'endpoint': {
          'uri': notifyEndpoint,
          'accept': 'application/json'
        }
      }
    };
    
    // Here the initial notification should not be received as the query is not matched
    await createSubscription(subscription);
  
    const newSpeed = 90;
    await updateAttribute(entityId, 'speed', newSpeed);
   
    // Now checking the content of the accumulator  
    const checkResponse = await http.get(accumulatorResource);
      
    expect(checkResponse.response.body).toHaveProperty(entityId);
    expect(checkResponse.response.body[entityId].length).toBe(1);
    expect(checkResponse.response.body[entityId][0].speed.value).toBe(newSpeed);
      
    await deleteSubscription(subscription.id);
  });
  
});
