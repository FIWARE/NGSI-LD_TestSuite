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


describe('Basic Notification. JSON-LD @context', () => {
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
  
  
  it('should not send a notification. Subscription to Entity Type. LD Context generates a different mapping', async function() {
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
      },
      '@context': 'https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld'
    };
    
    // Once subscription is created the first notification should be received
    await createSubscription(subscription, 'application/ld+json');
    
    await sleep(2000);
    
    const checkResponse = await http.get(accumulatorResource);
    
    // No notification should be delivered as the @context will map Vehicle to a different URI
    expect(checkResponse.response.body).not.toHaveProperty(entityId);
    
    await deleteSubscription(subscription.id);
  });
  
});
