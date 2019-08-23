

const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertRetrievedQuery = require('../common.js').assertRetrievedQuery;
const assertResultsQuery = require('../common.js').assertResultsQuery;
const assertNoResultsQuery = require('../common.js').assertNoResultsQuery;
const serializeParams = require('../common.js').serializeParams;

const JSON_LD = /application\/ld\+json(;.*)?/;

const JSON_LD_HEADER_CONTEXT = '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

const ACCEPT_JSON_LD = {
  'Accept': 'application/ld+json'
};

describe('Query Entity. JSON-LD. @context', () => {
  const entity = {
    'id': 'urn:ngsi-ld:T:I123k467:Context',
    'type': 'T_Query',
    'P100': {
      'type': 'Property',
      'value': 12,
    },
    'R100': {
      'type': 'Relationship',
      'object': 'urn:ngsi-ld:T2:6789',
    },
    '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
  };
  
  const entityId = encodeURIComponent(entity.id);

  beforeAll(() => {
    const JSON_LD_HEADERS = {
      'Content-Type': 'application/ld+json'
    };
    return http.post(entitiesResource, entity, JSON_LD_HEADERS);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entityId);
  });
    
  it('query by type name. Default @context. Not found as @context does not match.', async function() {
    const queryParams = {
      type: entity.type,
    };
            
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), ACCEPT_JSON_LD);
    assertNoResultsQuery(response,JSON_LD); 
  });
    
  it('query by type name. Right @context', async function() {
    const queryParams = {
      type: entity.type,
    };
        
    const headers = {
      'Accept': 'application/ld+json',
      'Link': JSON_LD_HEADER_CONTEXT
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
    assertRetrievedQuery(response,entity,JSON_LD); 
  });
  
  it('query by type URI', async function() {
    const queryParams = {
      type: 'http://example.org/T_Query',
    };
        
    const headers = {
      'Accept': 'application/ld+json',
      'Link': JSON_LD_HEADER_CONTEXT
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
    assertRetrievedQuery(response,entity,JSON_LD); 
  });
  
  it('query by type URI. No @context supplied', async function() {
    const queryParams = {
      type: 'http://example.org/T_Query',
    };
        
    const headers = {
      'Accept': 'application/ld+json'
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
    assertResultsQuery(response, 1); 
  });
  
  it('query by type URI. No matching', async function() {
    const queryParams = {
      type: 'http://example.com/T_Query',
    };
        
    const headers = {
      'Accept': 'application/ld+json',
      'Link': JSON_LD_HEADER_CONTEXT
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
    assertNoResultsQuery(response, JSON_LD);
  });
    
  it('query by condition over value. Default @context. Not found as @context does not match for the attribute.', async function() {
    const queryParams = {
      type: entity.type,
      q: 'P100>5'  
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), ACCEPT_JSON_LD);
    // Response here shall be JSON
    assertNoResultsQuery(response, JSON_LD);
  });
    
  it('query by condition over value. Right @context. ', async function() {
    const queryParams = {
      type: entity.type,  
      q: 'P100>5'  
    };
        
    const headers = {
      'Accept': 'application/ld+json',
      'Link': JSON_LD_HEADER_CONTEXT
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
    assertRetrievedQuery(response, entity, JSON_LD);
  });
  
});
