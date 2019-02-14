const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const subscriptionsResource = testedResource + '/subscriptions/';

const accumulatorEndpoint = 'http://localhost:3000';
const accumulatorResource = accumulatorEndpoint + '/dump';
const clearAccumulatorResource =  accumulatorEndpoint + '/clear';

const process = require('child_process');

const wait =  require('../common.js').wait;

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
    const requests = [];
    
    childProcess = process.spawn('node', ['./accumulator.js']);
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
    
    requests.push(http.post(entitiesResource, entity));
    
    return Promise.all(requests);
  });

  
  afterAll(() => {
    childProcess.kill();
    
    const requests = [];
      
    requests.push(http.delete(entitiesResource + entityId));
    requests.push(http.post(clearAccumulatorResource));
    
    return Promise.all(requests);
  });
    
    
  it('should get a notification. Simple subscription to any attribute', async function() {
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
          'uri': 'http://host.docker.internal:3000/acc',
          'accept': 'application/json'
        }
      }
    };
    
    // Once subscription is created the first notification should be received
    createSubscription(subscription);
    
    await wait(2000);
    
    const checkResponse = await http.get(accumulatorResource);
    
    // Only one notification corresponding to the subscription
    expect(checkResponse.response.body[entityId].length).toBe(1);
    expect(checkResponse.response.body[entityId][0].speed.value).toBe(entity.speed.value);
    
    deleteSubscription(subscription.id);
  });

  
  it('should get a notification. Subscription to one attribute with query', async function() {
    // Speed is updated so that the initial notification will not be received
    updateAttribute(entityId, 'speed', 10);
   
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
          'uri': 'http://host.docker.internal:3000/acc',
          'accept': 'application/json'
        }
      }
    };
    
    // Here the notification should not be received as the query is not matched
    createSubscription(subscription);

    const newSpeed = 90;
    updateAttribute(entityId, 'speed', newSpeed);
    
    await wait(2000);
   
    // Now checking the content of the accumulator  
    const checkResponse = await http.get(accumulatorResource);
      
    expect(checkResponse.response.body).toHaveProperty(entityId);
    expect(checkResponse.response.body[entityId].length).toBe(1);
    expect(checkResponse.response.body[entityId][0].speed.value).toBe(newSpeed);
      
    deleteSubscription(subscription.id);
  });
  
});
