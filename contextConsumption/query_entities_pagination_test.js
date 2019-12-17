const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const serializeParams = require('../common.js').serializeParams;

const assertResultsQuery = require('../common.js').assertResultsQuery;

describe('Query Entity. Pagination. JSON. Default @context', () => {
    const entity1 = {
        id: 'urn:ngsi-ld:T_Query:EntityForQueryPagination1',
        type: 'T_Query',
        P100: {
            type: 'Property',
            value: 12
        }
    };

    const entity2 = {
        id: 'urn:ngsi-ld:T_Query:EntityForQueryPagination2',
        type: 'T_Query',
        P100: {
            type: 'Property',
            value: 33
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

    it('query by type. No limit', async function() {
        const queryParams = {
            type: 'T_Query'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertResultsQuery(response, 2);
    });

    it('query by type. Limit 1', async function() {
        const queryParams = {
            type: 'T_Query',
            limit: 1
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertResultsQuery(response, 1);
    });
});
