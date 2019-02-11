const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const subscriptionsResource = testedResource + '/subscriptions/';

const accumulatorResource = 'http://localhost:3000/dump';

const process = require('child_process');

const wait =  require('../common.js').wait;

describe('Basic Notification. JSON', () => {
   // An entity is created
  const entity = {
    'id': 'urn:ngsi-ld:Vehicle:V1234',
    'type': 'Vehicle',
    'speed': {
      'type': 'Property',
      'value': 34
    }
  };

  const entityId = entity.id;
  
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
    'q': 'speed>50',
    'notification': {
      'attributes': ['speed'],
      'endpoint': {
        'uri': 'http://host.docker.internal:3000/acc',
        'accept': 'application/json'
      }
    }
  };
  
  var childProcess;
    
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
    requests.push(http.post(subscriptionsResource, subscription));
    
    return Promise.all(requests);
  });

  
  afterAll(() => {
    childProcess.kill();
    
    const requests = [];
      
    requests.push(http.delete(entitiesResource + entityId));
    requests.push(http.delete(subscriptionsResource + subscription.id));
    
    return Promise.all(requests);
  });
    
    
  it('should get a notification', async function() {
    const newSpeed = 65;
    
    const overwrittenAttrs = {
      'speed': {
        'type': 'Property',
        'value': newSpeed
      }
    };
    const response = await http.post(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 204);
   
    // Wait for the notification to arrive   
    wait(3000);
      
    const checkResponse = await http.get(accumulatorResource);
    
    expect(response.body).toHaveProperty(entityId);
    expect(response.body[entityId].speed.value).toBe(newSpeed);
  });
  
});
