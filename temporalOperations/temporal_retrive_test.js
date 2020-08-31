const http = require('../http.js');
const testedResource = require('../common.js').testedResource;
const entitiesResource = testedResource+'/temporal/entities/';
describe('Retrive Temporal Entity. JSON', () => {
    it('should retrive an temporal entity by ID 168', async function() {

        const response = await http.get(entitiesResource + "urn:ngsi-ld:testunit:159");
        expect(response.response).toHaveProperty('statusCode', 200);
    });  
});