const testedResource = require('../common.js').testedResource;
const assertCreated = require('../common.js').assertCreated;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

describe('Create Entity. JSON', () => {
    it('should create an empty entity 092', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T'
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. One Property 093', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            P1: {
                type: 'Property',
                value: 'Hola'
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. One GeoProperty 094', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            location: {
                type: 'GeoProperty',
                value: {
                    type: 'Point',
                    coordinates: [-8, 40]
                }
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Array of single element should be reduced 164', async function() {
        // Create an entity with an array with only one element
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            category: { type: 'Property', value: ['commercial'] }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);

        const checkResponse = await http.get(entitiesResource + entity.id);
        // should be a simple string on return - Remove the array - JSON-LD requirement
        entity.category = { type: 'Property', value: 'commercial' };

        expect(checkResponse.body).toEqual(entity);
    });

    it('should create an entity. One Property. DateTime 095', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            P1: {
                type: 'Property',
                value: {
                    '@type': 'DateTime',
                    '@value': '2018-12-04T12:00:00Z'
                }
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. Relationship 096', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            P1: {
                type: 'Property',
                value: 'Hola'
            },
            R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T2:6789'
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. observedAt 097', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            P1: {
                type: 'Property',
                value: 12,
                observedAt: '2018-12-04T12:00:00Z'
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. unitCode 098', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            P1: {
                type: 'Property',
                value: 12.45,
                unitCode: 'm'
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Relationship. observedAt 099', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T2:6789',
                observedAt: '2018-12-04T12:00:00Z'
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. Property 100', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            P1: {
                type: 'Property',
                value: 12,
                observedAt: '2018-12-04T12:00:00Z',
                P1_P1: {
                    type: 'Property',
                    value: 0.89
                }
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Relationship. Property 101', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T2:6789',
                R1_P1: {
                    type: 'Property',
                    value: 'V'
                }
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. Relationship 102', async function() {
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
                }
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Relationship. Relationship 104', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T2:6789',
                R1_R1: {
                    type: 'Relationship',
                    object: 'urn:ngsi-ld:T3:A2345'
                }
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Structured Property Value 105', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            SP1: {
                type: 'Property',
                value: {
                    type: 'PostalAddress',
                    addressLocality: 'Berlin',
                    addressCountry: 'DE'
                }
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Structured Property Value. Empty 106', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            SP1: {
                type: 'Property',
                value: {}
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Array Property Value 107', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            AP1: {
                type: 'Property',
                value: [1, 2, 3, 4]
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Empty Array Property Value 108', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            AP1: {
                type: 'Property',
                value: []
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Array Relationship Objects 109', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            AR1: {
                type: 'Relationship',
                object: ['urn:ngsi-ld:T:1234', 'urn:ngsi-ld:T:5678']
            }
        };

        const response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should report an error if Entity already exists 110', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T'
        };

        await http.post(entitiesResource, entity);
        const response2 = await http.post(entitiesResource, entity);

        expect(response2.response).toHaveProperty('statusCode', 409);
    });
});
