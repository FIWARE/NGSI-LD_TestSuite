const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';

describe('Delete Subscription', () => {
  const subscription = {
    'id': 'urn:ngsi-ld:Subscription:' + new Date().getTime(),
    'type': 'Subscription',
    'entities': [
        {
          'type': 'Vehicle'
        }
    ],
    'notification': {
        'attributes': ['speed'],
        'format': 'keyValues',
        'endpoint': {
          'uri': 'http://my.endpoint.org/notify',
          'accept': 'application/json'
        }
    }
  };
  
  const subscriptionId = encodeURIComponent(subscription.id);

  beforeAll(() => {
    return http.post(subscriptionsResource, subscription);
  });
    
  it('should delete the subscription', async function() {
    const response = await http.delete(subscriptionsResource + subscriptionId);
    expect(response.response).toHaveProperty('statusCode', 204);       
  });
    
  it('should return 404 if subscription does not exist', async function() {
    const response = await http.delete(subscriptionsResource + subscriptionId);
    expect(response.response).toHaveProperty('statusCode', 404);    
  });
  
});
