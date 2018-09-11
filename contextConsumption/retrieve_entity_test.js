'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';
var assertRetrieved = require('../common.js').assertRetrieved;

describe('Retrieve Entity. JSON. Default @context', () => {
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
        }
    };

    // Entity key Values
    let entityKeyValues = {
        'id': entity.id,
        'type': entity.type,
        'P1': entity.P1.value,
        'R1': entity.R1.object
    };

    // Entity projection only one attribute
    let entityOneAttr = {
        'id': entity.id,
        'type': entity.type,
        'P1': entity.P1
    };

    let entityNoAttr = {
        'id': entity.id,
        'type': entity.type,
    };

    beforeAll(() => {
        return http.post(entitiesResource, entity);
    });
    
    it('should retrieve the entity', async function() {
        let response = await http.get(entitiesResource + entity.id);
        assertRetrieved(response,entity);
    });
    
    it('should retrieve the entity key values mode', async function() {
        let response = await http.get(entitiesResource + entity.id + '?options=keyValues');
         assertRetrieved(response,entityKeyValues);
    });
    
    it('should retrieve the entity attribute projection', async function() {
        let response = await http.get(entitiesResource + entity.id + '?attrs=P1');
         assertRetrieved(response, entityOneAttr);
    });
    
    it('should retrieve the entity no attribute matches', async function() {
        let response = await http.get(entitiesResource + entity.id + '?attrs=notFoundAttr');
         assertRetrieved(response,entityNoAttr);
    });
    
    it('should report an error if the entity does not exist', async function() {
        let response = await http.get(entitiesResource + 'urn:ngsi-ld:xxxxxxx');
        expect(response.response).toHaveProperty('statusCode', 404);
    }); 
});
