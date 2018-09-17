'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';
var assertRetrieved = require('../common.js').assertRetrieved;

const JSON_LD = /application\/ld\+json(;.*)?/;

const JSON_LD_HEADERS_POST = {
  'Content-Type': 'application/ld+json'
};

const JSON_LD_HEADERS_GET = {
  'Accept': 'application/ld+json'
};

describe('Retrieve Entity. JSON-LD. @context ', () => {
  let entity = {
    'id': 'urn:ngsi-ld:T' + ':' + new Date().getTime(),
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

  // Entity key Values
  let entityKeyValues = {
    'id': entity.id,
    'type': entity.type,
    'P1': entity.P1.value,
    'R1': entity.R1.object,
    '@context': entity['@context']
  };

  // Entity projection only one attribute
  let entityOneAttr = {
    'id': entity.id,
    'type': entity.type,
    'P1': entity.P1,
    '@context': entity['@context']
  };

  let entityNoAttr = {
    'id': entity.id,
    'type': entity.type,
    '@context': entity['@context']
  };

  beforeAll(() => {
    return http.post(entitiesResource, entity, JSON_LD_HEADERS_POST);
  });
  
  it('should retrieve the entity. JSON-LD MIME Type requested', async function() {
    let response = await http.get(entitiesResource + entity.id, JSON_LD_HEADERS_GET);
    assertRetrieved(response,entity, JSON_LD);
  });
    
  it('should retrieve the entity. JSON MIME type (default)', async function() {
    let response = await http.get(entitiesResource + entity.id);
    assertRetrieved(response,entity);
  });
    
  it('should retrieve the entity key values mode', async function() {
    let response = await http.get(entitiesResource + entity.id + '?options=keyValues', JSON_LD_HEADERS_GET);
    assertRetrieved(response,entityKeyValues,JSON_LD);
  });
    
  it('should retrieve the entity attribute projection', async function() {
    var headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    let response = await http.get(entitiesResource + entity.id + '?attrs=P1', headers);
    assertRetrieved(response,entityOneAttr, JSON_LD);
  });
    
  it('should retrieve the entity no attribute matches', async function() {
    var headers = {
      'Accept': 'application/ld+json',
      'Link': '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    let response = await http.get(entitiesResource + entity.id + '?attrs=notFoundAttr', headers);
    assertRetrieved(response, entityNoAttr, JSON_LD);
  });

  it('should retrieve the entity no attribute matches as @context differs', async function() {
    var headers = {
      'Accept': 'application/ld+json',
      // Observe that the provided @context will make the attribute not to match
      'Link': '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testContext2.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    let response = await http.get(entitiesResource + entity.id + '?attrs=P1', headers);
    assertRetrieved(response,entityNoAttr, JSON_LD);
  });
});
