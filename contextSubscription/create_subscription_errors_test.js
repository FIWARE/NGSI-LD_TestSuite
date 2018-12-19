const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';

describe('Create Subscription. Errors. JSON', () => {
  it('should reject a subscription which id is not a URI', async function() {
    const subscription = {
      'id': 'abcdef',
      'type': 'Subscription'
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject a subscription which type is not Subscription', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'abcded'
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject a subscription which does not include "entities" nor "watachedAttributes"', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'Subscription'
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject a subscription which watched attributes is null', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'Subscription',
      'watchedAttributes': null
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

 it('should reject a subscription which watched attributes array is 0 length', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'Subscription',
      'watchedAttributes': []
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });
 
 it('should reject a subscription which entities array is 0 length', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'Subscription',
      'entities': []
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });
 
  it('should reject a subscription which entities array does not contain a type', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'Subscription',
      'entities': [{
        'id': 'urn:ngsi-ld:T:T1234'
      }]
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });
  
  it('should reject a subscription which does not define notification parameters', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'Subscription',
      'entities': [{
        'id': 'urn:ngsi-ld:T:T1234',
        'type': 'T'
      }]
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  });
   
  it('should reject a subscription which "isActive" field is not a boolean', async function() {
    const subscription = {
      'id': 'urn:ngsi-ld:Subscription:9000',
      'type': 'Subscription',
      'entities': [{
        'id': 'urn:ngsi-ld:T:T1234',
        'type': 'T'
      }],
      "watchedAttributes": ["a1"],
      'notification': {
        'endpoint': {
          'uri': 'http://localhost:1080'
        }
      },
      'isActive': "ertyy"
    };

    const response = await http.post(subscriptionsResource, subscription);
    expect(response.response).toHaveProperty('statusCode', 400);
  }); 

  // TODO: Add here more tests (null values, etc.)
});
