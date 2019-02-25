/*eslint no-console: "off"*/

const common = require('../common.js');

const testedResource = common.testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const accumulatorEndpoint = common.accEndpoint;
const accumulatorResource = accumulatorEndpoint + '/dump';
const clearAccumulatorResource =  accumulatorEndpoint + '/clear';

const notifyEndpoint = common.notifyEndpoint;

const sleep =  common.sleep;
const spawn =  common.spawn;

const path = require('path');


const notifsCommon = require('./notification_common.js');

const createSubscription = notifsCommon.createSubscription;
const deleteSubscription = notifsCommon.deleteSubscription;


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
    const requests = [];
    requests.push(http.post(clearAccumulatorResource));
    // Entity is recreated to start from a known state
    requests.push(http.post(entitiesResource, entity));
    
    return Promise.all(requests);
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
      
        resolve();
      });
    });
  });

  
  afterAll(() => {
    childProcess.kill();
  });
  
  
  afterEach(() => {
    return http.delete(entitiesResource + entityId);
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
