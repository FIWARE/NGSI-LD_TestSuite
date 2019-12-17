const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {
    const copy = JSON.parse(JSON.stringify(target));
    return Object.assign(copy, patch);
}

describe('Partial Entity Attribute Update. JSON. Default @context', () => {
    const entity = {
        id: 'urn:ngsi-ld:T:' + new Date().getTime(),
        type: 'T',
        P1: {
            type: 'Property',
            value: 12,
            observedAt: '2018-12-04T12:00:00Z',
            P1_R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T2:6789'
            },
            P1_P1: {
                type: 'Property',
                value: 0.79
            }
        }
    };

    const entityId = encodeURIComponent(entity.id);

    const partialUpdate = {
        value: 55
    };

    beforeAll(() => {
        return http.post(entitiesResource, entity);
    });

    afterAll(() => {
        return http.delete(entitiesResource + entityId);
    });

    it('Partial Attribute Update.', async function() {
        const response = await http.patch(entitiesResource + entityId + '/attrs/P1', partialUpdate);
        expect(response.response).toHaveProperty('statusCode', 204);

        const checkResponse = await http.get(entitiesResource + entityId);

        const finalEntity = patchObj(entity, {});
        finalEntity.P1.value = partialUpdate.value;
        expect(checkResponse.body).toEqual(finalEntity);
    });

    it('Partial Attribute Update. Target entity does not exist', async function() {
        const response = await http.patch(entitiesResource + 'urn:ngsi-ld:doesnotexist/attrs/P1', partialUpdate);

        expect(response.response).toHaveProperty('statusCode', 404);
    });

    it('Partial Attribute Update. Target Attribute does not exist', async function() {
        const response = await http.patch(entitiesResource + entityId + '/attrs/NonExistentAttribute', partialUpdate);

        expect(response.response).toHaveProperty('statusCode', 404);
    });

    it('Partial Attribute Update. Empty Payload', async function() {
        const response = await http.patch(entitiesResource + entityId + '/attrs/P1', {});

        expect(response.response).toHaveProperty('statusCode', 400);
    });
});
