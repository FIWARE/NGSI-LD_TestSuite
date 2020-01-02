const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

describe('Delete Entity.', () => {
    const entity = {
        id: 'urn:ngsi-ld:T:' + new Date().getTime(),
        type: 'T'
    };

    const entityId = encodeURIComponent(entity.id);

    beforeAll(() => {
        return http.post(entitiesResource, entity);
    });

    it('should delete the entity 119', async function() {
        const response = await http.delete(entitiesResource + entityId);
        expect(response.response).toHaveProperty('statusCode', 204);
    });

    it('should return 404 if entity does not exist 120', async function() {
        const response = await http.delete(entitiesResource + entityId);
        expect(response.response).toHaveProperty('statusCode', 404);
    });
});
