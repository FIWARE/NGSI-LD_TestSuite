'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';
var assertRetrievedQuery = require('../common.js').assertRetrievedQuery;
var assertNoResultsQuery = require('../common.js').assertNoResultsQuery;
var serializeParams = require('../common.js').serializeParams;

const JSON_LD = /application\/ld\+json(;.*)?/;

const JSON_LD_HEADER_CONTEXT = '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

describe('Query Entity. JSON-LD. @context', () => {
    let entity = {
        'id': 'urn:ngsi-ld:T:I123k467:Context',
        'type': 'T_Query',
        'P1': {
            'type': 'Property',
            'value': 12,
        },
        'R1': {
            'type': 'Relationship',
            'object': 'urn:ngsi-ld:T2:6789',
        },
        '@context': 'https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld'
    };

    beforeAll(() => {
        const JSON_LD_HEADERS = {
            'Content-Type': 'application/ld+json'
        };
        return http.post(entitiesResource, entity, JSON_LD_HEADERS);
    });
    
    afterAll(() => {
        return http.delete(entitiesResource + entity.id);
    });
    
    it('query by type. Default @context. Not found as @context does not match.', async function() {
        let queryParams = {
          type: 'T_Query',
        };
            
        let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertNoResultsQuery(response,JSON_LD); 
    });
    
    it('query by type. Right @context', async function() {
        let queryParams = {
          type: 'T_Query',
        };
        
        let headers = {
            'Accept': 'application/ld+json',
             'Link': JSON_LD_HEADER_CONTEXT
        };
        
        let response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
        assertRetrievedQuery(response,entity,JSON_LD); 
    });
    
    it('query by condition over value. Default @context. Not found as @context does not match for the attribute.', async function() {
        let queryParams = {
          q: 'P1>5'  
        };
        
        let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        // Response here shall be JSON
        assertNoResultsQuery(response);
    });
    
    it('query by condition over value. Right @context. ', async function() {
        let queryParams = {
          id: entity.id,  
          q: 'P1>5'  
        };
        
         let headers = {
            'Accept': 'application/ld+json',
            'Link': JSON_LD_HEADER_CONTEXT
        };
        
        let response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
        assertRetrievedQuery(response, entity, JSON_LD);
    });
});
