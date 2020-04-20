const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

describe('Create Entity. Errors. JSON', () => {
    it('should reject an entity which id is not a URI 082', async function() {
        const entity = {
            id: 'abcdef',
            type: 'T'
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject an entity which node type is not recognized 083', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T4:9000',
            type: 'T',
            P1: {
                type: 'abcdef',
                value: 34
            }
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject an entity which contain attributes with forbidden characters 084', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T4:9000',
            type: 'T',
            'P?|{{': {
                type: 'Property',
                value: 345
            }
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject an entity with a property value equal to null 085', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T4:9000',
            type: 'T',
            P1: {
                type: 'Property',
                value: null
            }
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject an entity with a Relationship with no object 086', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T4:9000',
            type: 'T',
            R1: {
                type: 'Relationship',
                value: '1234'
            }
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject an entity with a Property with no value 087', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T4:9000',
            type: 'T',
            P1: {
                type: 'Property',
                object: '1234'
            }
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject an entity with a Relationship object equal to null 088', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T4:9000',
            type: 'T',
            R1: {
                type: 'Relationship',
                object: null
            }
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject an entity with a Property of a Property without a Type  088', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T4:9000',
            type: 'T',
            price: { type: 'Property', value: 10.99, currency: 'EUR' }
        };

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should report an error if @context is provided in a JSON payload 089', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T',
            '@context': 'http://example.org/ldContext/'
        };

        const response = await http.post(entitiesResource, entity);

        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should report an error if no @context is provided in a JSON-LD payload 090', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T'
        };

        const response = await http.post(entitiesResource, entity, {
            'Content-Type': 'application/ld+json'
        });

        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should report an error if a JSON-LD header is provided with a JSON-LD payload 091', async function() {
        const entity = {
            id: 'urn:ngsi-ld:T:' + new Date().getTime(),
            type: 'T'
        };

        const response = await http.post(entitiesResource, entity, {
            'Content-Type': 'application/ld+json',
            Link:
                '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        });

        expect(response.response).toHaveProperty('statusCode', 400);
    });

    // TODO: Add here more tests (null values, etc.)
});
