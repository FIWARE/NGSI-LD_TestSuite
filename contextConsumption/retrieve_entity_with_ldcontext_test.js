'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';
var assertRetrieved = require('../common.js').assertRetrieved;

const JSON_LD = 'application/ld+json';
const JSON_LD_HEADERS_POST = {
    'Content-Type': JSON_LD
};

const JSON_LD_HEADERS_GET = {
    'Accept': JSON_LD
};

describe('Retrieve Entity. JSON-LD. @context ', () => {
    let entity = {
        'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
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
    
    it('should retrieve the entity', async function() {
        let response = await http.get(entitiesResource + entity.id, JSON_LD_HEADERS_GET);
        assertRetrieved(response,entity, JSON_LD);
    });
    
    it('should retrieve the entity key values mode', async function() {
        let response = await http.get(entitiesResource + entity.id + '?options=keyValues', JSON_LD_HEADERS_GET);
         assertRetrieved(response,entity,JSON_LD);
    });
    
    it('should retrieve the entity attribute projection', async function() {
        var headers = {
            'Accept': JSON_LD,
            'Link': '<https://fiware.github.io/NGSI-LD_Tests/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        };
        let response = await http.get(entitiesResource + entity.id + '?attrs=P1', headers);
        assertRetrieved(response,entity, JSON_LD);
    });
    
    it('should retrieve the entity no attribute matches', async function() {
        let response = await http.get(entitiesResource + entity.id + '?attrs=notFoundAttr', JSON_LD_HEADERS_GET);
         assertRetrieved(response,entity, JSON_LD);
    });
    
    it('should report an error if the entity does not exist', async function() {
        let response = await http.get(entitiesResource + 'urn:ngsi-ld:xxxxxxx', JSON_LD_HEADERS_GET);
        expect(response.response).toHaveProperty('statusCode', 404);
    });
});
