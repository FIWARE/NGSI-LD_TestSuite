'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';

describe('NGSI-LD Protocol. Errors', () => {
    it('should reject content which is not JSON nor JSON-LD', async function() {
        let data = {
          'id': 'abcdef',
          'type': 'T'
        };

        let response = await http.post(entitiesResource, data, { 'Content-Type': 'image/gif' });
        expect(response.response).toHaveProperty('statusCode', 415);
    });

    // TODO: Add here more tests
});
