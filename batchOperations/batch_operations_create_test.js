const testedResource = require('../common.js').testedResource;
const assertBatchOperation = require('../common.js').assertBatchOperation;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const batchCreationResource = testedResource + '/entityOperations/create';

describe('Batch Entity Creation. JSON', () => {
    const entity1 = {
        id: 'urn:ngsi-ld:T:' + new Date().getTime(),
        type: 'T'
    };

    const entity2 = {
        id: 'urn:ngsi-ld:T:' + new Date().getTime(),
        type: 'T',
        P1: {
            type: 'Property',
            value: 'Hola'
        }
    };

    const entityIds = [encodeURIComponent(entity1.id), encodeURIComponent(entity2.id)];

    afterAll(() => {
        const requests = [];

        for (let j = 0; j < entityIds.length; j++) {
            requests.push(http.delete(entitiesResource + entityIds[j]));
        }

        return Promise.all(requests);
    });

     // issue is raised in Github https://github.com/FIWARE/context.Orion-LD/issues/303
    it('should create a list of entities 001', async function() {
        const entities = [entity1, entity2];

        const response = await http.post(batchCreationResource, entities);

        expect(response.response).toHaveProperty('statusCode', 200);
        assertBatchOperation(response, [entities[0].id, entities[1].id], []);
    });
});
