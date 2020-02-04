const testedResource = require('../common.js').testedResource;
const assertBatchOperation = require('../common.js').assertBatchOperation;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const batchUpdateResource = testedResource + '/entityOperations/update';

describe('Batch Entity Update. JSON', () => {
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

     // issue is raised in Github https://github.com/FIWARE/context.Orion-LD/issues/303
     it('should update a list of entities 003', async function() {
        const entity11 = {
            id: entity1.id,
            type: 'T',
            P100: {
                type: 'Property',
                value: 32
            }
        };

        const entity22 = {
            id: entity2.id,
            type: 'T',
            P1: {
                type: 'Property',
                value: 'New value'
            }
        };

        const entities2 = [entity11, entity22];

        // Entity 1 a new attribute P100 is appended
        // Entity 2 P1 will get a new value (default mode is overwrite)
        const response = await http.post(batchUpdateResource, entities2);

        expect(response.response).toHaveProperty('statusCode', 200);
        assertBatchOperation(response, [entities2[0].id, entities2[1].id], []);
    });
});
