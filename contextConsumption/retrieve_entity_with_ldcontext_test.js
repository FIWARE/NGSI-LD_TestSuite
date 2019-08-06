const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertRetrieved = require('../common.js').assertRetrieved;

const JSON_LD = /application\/ld\+json(;.*)?/;
const PLAIN_JSON = /application\/json(;.*)?/;

const JSON_LD_HEADERS_POST = {
  'Content-Type': 'application/ld+json'
};

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {  
  const copy = JSON.parse(JSON.stringify(target));
  return Object.assign(copy, patch);
}

describe('Retrieve Entity. JSON-LD. @context ', () => {
  const entity = {
    'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
    'type': 'T',
    'P1': {
      'type': 'Property',
      'value': 12,
      'observedAt': '2018-12-04T12:00:00Z',
      'P1_R1': {
        'type': 'Relationship',
        'object': 'urn:ngsi-ld:T2:6789'
      },
      'P1_P1': {
        'type': 'Property',
        'value': 0.79
      }
    },
    'R1': {
      'type': 'Relationship',
      'object': 'urn:ngsi-ld:T2:6789',
      'R1_R1': {
        'type': 'Relationship',
        'object': 'urn:ngsi-ld:T3:A2345'
      },
      'R1_P1': {
        'type': 'Property',
        'value': false
      }
    },
    '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
  };
  
  const entityId = encodeURIComponent(entity.id);

  // Entity key Values
  const entityKeyValues = {
    'id': entity.id,
    'type': entity.type,
    'P1': entity.P1.value,
    'R1': entity.R1.object,
    '@context': entity['@context']
  };

  // Entity projection only one attribute
  const entityOneAttr = {
    'id': entity.id,
    'type': entity.type,
    'P1': entity.P1,
    '@context': entity['@context']
  };

  const entityNoAttr = {
    'id': entity.id,
    'type': entity.type,
    '@context': entity['@context']
  };
  
  const entityNoContext = patchObj({}, entity);
  delete entityNoContext['@context'];

  beforeAll(() => {
    return http.post(entitiesResource, entity, JSON_LD_HEADERS_POST);
  });
  
  afterAll(() => {
    return http.delete(entitiesResource + entityId);
  });
  
  it('should retrieve the entity. application/ld+json MIME Type Accepted. JSON-LD', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entity, JSON_LD);
  });
    
  it('should retrieve the entity. (non-present accept header). JSON', async function() {
    const headers = {
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entityNoContext, PLAIN_JSON);
  });
  
  it('should retrieve the entity. Any Media Type Accepted. JSON-LD', async function() {
    const headers = {
      'Accept': '*/*',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response,entity, JSON_LD);
  });
  
  it('should retrieve the entity. Any application/* Media Type Accepted. JSON-LD', async function() {
    const headers = {
      'Accept': 'application/*',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entity, JSON_LD);
  });
  
  
  it('should retrieve the entity. application/json MIME Type Accepted. JSON', async function() {
    const headers = {
      'Accept': 'application/json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entityNoContext, PLAIN_JSON);
  });
  
  
  it('should retrieve the entity. application/ld+json MIME Type Accepted. JSON-LD', async function() {
    const headers = {
      'Accept': 'application/ld+json, application/json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entity, JSON_LD);
  });
  
  
   it('should retrieve the entity. application/json MIME Type wins as it is more specific. JSON', async function() {
    const headers = {
      'Accept': '*/*, application/json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entityNoContext, PLAIN_JSON);
  });
   
   
  it('should retrieve the entity. application/json MIME Type wins as it is more specific. JSON', async function() {
    const headers = {
      'Accept': 'application/*, application/json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entityNoContext, PLAIN_JSON);
  });

  
  it('should retrieve the entity. application/ld+json MIME Type expanded from range. JSON-LD', async function() {
    const headers = {
      'Accept': 'text/plain, application/*',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entity, JSON_LD);
  }); 
  
  
  it('should retrieve the entity. application/json MIME Type wins as it has more weight. JSON', async function() {
    const headers = {
      'Accept': 'application/json, application/ld+json; q=0.8',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId, headers);
    assertRetrieved(response, entityNoContext, PLAIN_JSON);
  }); 

    
  it('should retrieve the entity key values mode', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId + '?options=keyValues', headers);
    assertRetrieved(response,entityKeyValues, JSON_LD);
  });
 
    
  it('should retrieve the entity attribute projection', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId + '?attrs=P1', headers);
    assertRetrieved(response,entityOneAttr, JSON_LD);
  });

    
  it('should retrieve the entity no attribute matches', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId + '?attrs=notFoundAttr', headers);
    assertRetrieved(response, entityNoAttr, JSON_LD);
  });

  
  it('should retrieve the entity no attribute matches as @context differs', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      // Observe that the provided @context will make the attribute not to match
      'Link': '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const expectedEntityNoAttr = {
    'id': entity.id,
    'type': 'http://example.org/T',
    '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld'
  };
    
    const response = await http.get(entitiesResource + entityId + '?attrs=P1', headers);
    assertRetrieved(response, expectedEntityNoAttr, JSON_LD);
  });
  
});
