

const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertRetrieved = require('../common.js').assertRetrieved;

const JSON_LD = /application\/ld\+json(;.*)?/;

const JSON_LD_HEADERS_POST = {
  'Content-Type': 'application/ld+json'
};

const JSON_LD_HEADERS_GET = {
  'Accept': 'application/ld+json'
};

describe('Retrieve Entity. JSON-LD. @context ', () => {
  const entity = {
    'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
    'type': 'T',
    'P1': {
      'type': 'Property',
      'value': 12,
      'observedAt': '2018-12-04T12:00:00',
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
    '@context': 'https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld'
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

  beforeAll(() => {
    return http.post(entitiesResource, entity, JSON_LD_HEADERS_POST);
  });
  
  afterAll(() => {
    return http.delete(entitiesResource + entityId);
  });
  
  it('should retrieve the entity. JSON-LD MIME Type requested', async function() {
    const response = await http.get(entitiesResource + entityId, JSON_LD_HEADERS_GET);
    assertRetrieved(response,entity, JSON_LD);
  });
    
  it('should retrieve the entity. JSON MIME type (default)', async function() {
    const response = await http.get(entitiesResource + entityId);
    assertRetrieved(response,entity);
  });
    
  it('should retrieve the entity key values mode', async function() {
    const response = await http.get(entitiesResource + entityId + '?options=keyValues', JSON_LD_HEADERS_GET);
    assertRetrieved(response,entityKeyValues,JSON_LD);
  });
    
  it('should retrieve the entity attribute projection', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId + '?attrs=P1', headers);
    assertRetrieved(response,entityOneAttr, JSON_LD);
  });
    
  it('should retrieve the entity no attribute matches', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId + '?attrs=notFoundAttr', headers);
    assertRetrieved(response, entityNoAttr, JSON_LD);
  });

  it('should retrieve the entity no attribute matches as @context differs', async function() {
    const headers = {
      'Accept': 'application/ld+json',
      // Observe that the provided @context will make the attribute not to match
      'Link': '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testContext2.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.get(entitiesResource + entityId + '?attrs=P1', headers);
    assertRetrieved(response,entityNoAttr, JSON_LD);
  });
  
});
