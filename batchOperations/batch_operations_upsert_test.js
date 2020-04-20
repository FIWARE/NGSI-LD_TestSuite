const testedResource = require('../common.js').testedResource;
const http = require('../http.js');
const entitiesResource = testedResource + '/entities/';
const batchUpsertResource = testedResource + '/entityOperations/upsert';

describe('Batch Entity Upsert. JSON', () => {
    const entity1 = {
        id: 'urn:ngsi-ld:T:' + new Date().getTime(),
        type: 'T'
    };

    const entity2 = {
        id: 'urn:ngsi-ld:T:' + new Date().getTime() + 1,
        type: 'T',
        P1: {
            type: 'Property',
            value: 'Hola'
        }
    };

    const entities = [entity1, entity2];

    const entityIds = [encodeURIComponent(entity1.id), encodeURIComponent(entity2.id)];

    beforeAll(() => {
        const requests = [];

        for (let j = 0; j < entities.length; j++) {
            requests.push(http.post(entitiesResource, entities[j]));
        }

        return Promise.all(requests);
    });

    afterAll(() => {
        const requests = [];

        for (let j = 0; j < entityIds.length; j++) {
            requests.push(http.delete(entitiesResource + entityIds[j]));
        }

        return Promise.all(requests);
    });

    it('should upsert a list of entities 004', async function() {
        // const entities2 = [entity1, entity2];
        // Default mode is replace (for upsert)
        const response = await http.post(batchUpsertResource, entities);

        expect(response.response).toHaveProperty('statusCode', 204);
        //assertBatchOperation(response, [entities2[0].id, entities2[1].id], []);
    });
});
