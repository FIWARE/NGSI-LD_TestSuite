const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';
const assertRetrieved = require('../common.js').assertRetrieved;

const JSON_LD = /application\/ld\+json(;.*)?/;

const JSON_LD_HEADERS_POST = {
  'Content-Type': 'application/ld+json'
};

const JSON_LD_HEADERS_GET = {
  'Accept': 'application/ld+json'
};


describe('Retrieve Subscription. JSON-LD. @context', () => {
  const subscription = {
    'id': 'urn:ngsi-ld:Subscription:mySubscription' + new Date().getTime(),
    'type': 'Subscription',
    'entities': [
        {
          'type': 'T'
        }
    ],
    'watchedAttributes': ['P1'],
    'q': 'P1>50',
    'geoQ': {
      'georel': 'near;maxDistance==2000',
      'geometry': 'Point',
      'coordinates': [-1, 100]
    },
    'notification': {
      'attributes': ['P1'],
      'format': 'keyValues',
      'endpoint': {
        'uri': 'http://my.endpoint.org/notify',
        'accept': 'application/json'
      }
    },
    '@context': 'https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld'
  };
  
  const subscriptionId = encodeURIComponent(subscription.id);

  beforeAll(() => {
    return http.post(subscriptionsResource, subscription, JSON_LD_HEADERS_POST);
  });
  
  afterAll(() => {
    return http.delete(subscriptionsResource + subscriptionId);
  });
    
  it('should retrieve the subscription', async function() {
    const response = await http.get(subscriptionsResource + subscriptionId, JSON_LD_HEADERS_GET);
    assertRetrieved(response, subscription, JSON_LD);
  });
    
  it('should report an error if the subscription does not exist', async function() {
    const response = await http.get(subscriptionsResource + encodeURIComponent('urn:ngsi-ld:xxxxxxx'), JSON_LD_HEADERS_GET);
    expect(response.response).toHaveProperty('statusCode', 404);
  });
  
});
