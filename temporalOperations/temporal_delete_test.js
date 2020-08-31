const http = require('../http.js');
const testedResource = require('../common.js').testedResource;
const entitiesResource = testedResource+'/temporal/entities/';

describe('Delete temporal entity', () => {
    it('should delete temporal entity 169', async function() {

        const response = await http.delete(entitiesResource + "urn:ngsi-ld:testunit:159");
        expect(response.response).toHaveProperty('statusCode', 204);
    });  
    
    it('should delete temporal entity by attribute ID 170', async function() {

        const response = await http.delete(entitiesResource + "urn:ngsi-ld:testunit:159/attrs/airQualityLevel");
        expect(response.response).toHaveProperty('statusCode', 204);
    });  
});