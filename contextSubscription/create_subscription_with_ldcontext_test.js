const testedResource = require('../common.js').testedResource;
const assertSubscriptionCreated = require('../common.js').assertSubscriptionCreated;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';

const JSON_LD_HEADERS = {
  'Content-Type': 'application/ld+json'
};

describe('Create Subscription. JSON-LD @context', () => {
  
  it('should create an entity with JSON-LD @context as single URI', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:' + new Date().getTime(),
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
        'attributes': ['P2'],
        'format': 'keyValues',
        'endpoint': {
          'uri': 'http://my.endpoint.org/notify',
          'accept': 'application/json'
        }
      },
      '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
    };

    const response = await http.post(subscriptionsResource, subscription, JSON_LD_HEADERS);
    assertSubscriptionCreated(response.response, subscription.id);
  });
  
});
