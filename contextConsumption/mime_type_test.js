const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertResponse = require('../common.js').assertResponse;

describe('MIME Type Tests', () => {
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
        },
        R1: {
            type: 'Relationship',
            object: 'urn:ngsi-ld:T2:6789',
            R1_R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T3:A2345'
            },
            R1_P1: {
                type: 'Property',
                value: false
            }
        }
    };

    const entityId = encodeURIComponent(entity.id);

    beforeAll(() => {
        return http.post(entitiesResource, entity);
    });

    afterAll(() => {
        return http.delete(entitiesResource + entityId);
    });

    it('should retrieve the entity. application/ld+json 006', async function() {
        const response = await http.get(entitiesResource + entityId, {
            Accept: 'application/ld+json'
        });
        assertResponse(response, 'application/ld+json');
    });

    it('should retrieve the entity. application/* 007', async function() {
        const response = await http.get(entitiesResource + entityId, {
            Accept: 'application/*'
        });
        assertResponse(response, 'application/ld+json');
    });

    it('should retrieve the entity. application/json 008', async function() {
        const response = await http.get(entitiesResource + entityId, {
            Accept: 'application/json'
        });
        assertResponse(response, 'application/json');
    });

    it('should retrieve the entity. */* 009', async function() {
        const response = await http.get(entitiesResource + entityId, {
            Accept: '*/*'
        });
        assertResponse(response, 'application/ld+json');
    });

    it('should retrieve the entity. No Accept Header 010', async function() {
        const response = await http.get(entitiesResource + entityId);
        assertResponse(response, 'application/json');
    });
});
