'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';
var assertRetrieved = require('../common.js').assertRetrieved;

describe('Delete Entity Attribute. Default @context', () => {
    let entity = {
        'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
        'type': 'T',
        'P1': {
            'type': 'Property',
            'value': 'abcde'
        }
    };

    beforeAll(() => {
        return http.post(entitiesResource, entity);
    });
    
    it('should delete the entity attribute', async function() {
        let response = await http.delete(entitiesResource + entity.id + '/' + 'attrs' + '/' + 'P1');
        expect(response.response).toHaveProperty('statusCode', 204);       
    });
    
    it('should return 404 if attribute does not exist', async function() {
        let response = await http.delete(entitiesResource + entity.id + '/' + 'attrs' + '/' + 'P1');
         expect(response.response).toHaveProperty('statusCode', 404);    
    });
});
