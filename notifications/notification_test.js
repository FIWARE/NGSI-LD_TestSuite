/*eslint no-console: "off"*/

const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const accumulatorEndpoint = require('../common.js').accEndpoint;
const accumulatorResource = accumulatorEndpoint + '/dump';
const clearAccumulatorResource =  accumulatorEndpoint + '/clear';

const notifyEndpoint = require('../common.js').notifyEndpoint;

const sleep =  require('../common.js').sleep;
const spawn =  require('../common.js').spawn;

const path = require('path');

const createSubscription = require('./notification_common.js').createSubscription;
const deleteSubscription = require('./notification_common.js').deleteSubscription;
const updateAttribute = require('./notification_common.js').updateAttribute;


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
      spawn('node', [path.join(__dirname, 'accumulator.js')]).then((pchildProcess) => {
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
    
    // Two notifications one corresponding to the initial subscription another corresponding to
    // The update of the speed attribute
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
    
    // Only one notification as it should only be sent when the filter conditions are met
    expect(checkResponse.response.body).toHaveProperty(entityId);
    expect(checkResponse.response.body[entityId].length).toBe(1);
    expect(checkResponse.response.body[entityId][0].speed.value).toBe(newSpeed);
      
    await deleteSubscription(subscription.id);
  });

  
  it('should not send a notification. Subscription to entity which id does not match', async function() {
    // Speed is updated so that the initial notification will not be received
    await updateAttribute(entityId, 'speed', 10);
   
     // A Subscription is created
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
      'type': 'Subscription',
      'entities': [
        {
          'type': 'Vehicle',
          // Id will not match
          'id': entity.id + 'x'
        }
      ],
      'notification': {
        'endpoint': {
          'uri': notifyEndpoint,
          'accept': 'application/json'
        }
      }
    };
    
    // Here the initial notification should not be received as the query is not matched
    await createSubscription(subscription);
   
    // Now checking the content of the accumulator  
    const checkResponse = await http.get(accumulatorResource);
    
    // Only one notification as it should only be sent when the filter conditions are met
    expect(checkResponse.response.body).not.toHaveProperty(entityId);
    expect(checkResponse.response.body).not.toHaveProperty(entityId + 'x');
      
    await deleteSubscription(subscription.id);
  });
  
  
  it('should not send a notification. Subscription to entity which type does not match', async function() {   
     // A Subscription is created
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
      'type': 'Subscription',
      'entities': [
        {
          // type will not match
          'type': 'Vehicle1',
          'id': entity.id
        }
      ],
      'notification': {
        'endpoint': {
          'uri': notifyEndpoint,
          'accept': 'application/json'
        }
      }
    };
    
    // Here the initial notification should not be received as the query is not matched
    await createSubscription(subscription);
   
    // Now checking the content of the accumulator
    const checkResponse = await http.get(accumulatorResource);
    
    // Entity id matches but entity type does not match ... so ... no notification
    expect(checkResponse.response.body).not.toHaveProperty(entityId);
      
    await deleteSubscription(subscription.id);
  });
  
  
});
