const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertRetrievedAlternatives = require('../common.js').assertRetrievedAlternatives;

const JSON_LD_HEADERS = {
    'Content-Type': 'application/ld+json'
};

const ACCEPT_LD = {
    Accept: 'application/ld+json'
};

const coreContexts = [
    'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
    ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld']
];

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {
    const copy = JSON.parse(JSON.stringify(target));
    return Object.assign(copy, patch);
}

describe('Append Entity Attributes. JSON-LD @context', () => {
    let entity = {
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
        '@context': 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
    };

    const appendedAttributes = {
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
        },
        location: {
            type: 'GeoProperty',
            value: {
                type: 'Point',
                coordinates: [-8.01, 40.01]
            }
        },
        '@context': 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
    };
    /*  
  const appendedAttributesOtherContext = {
    'P3': {
      'type': 'Relationship',
      'object': 'urn:ngsi-ld:T2:6789',
    },
    '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld'
  };
  */

    // The Entity Id has to be properly encoded
    const entityId = encodeURIComponent(entity.id);

    beforeAll(() => {
        return http.post(entitiesResource, entity, JSON_LD_HEADERS);
    });

    afterAll(() => {
        return http.delete(entitiesResource + entityId);
    });

    it('append Entity Attributes 079', async function() {
        const response = await http.post(`${entitiesResource}${entityId}/attrs/`, appendedAttributes, JSON_LD_HEADERS);

        expect(response.response).toHaveProperty('statusCode', 204);

        const checkResponse = await http.get(`${entitiesResource}${entityId}`, ACCEPT_LD);

        entity = patchObj(entity, appendedAttributes);
        assertRetrievedAlternatives(checkResponse, entity, 'application/ld+json', coreContexts);
    });

    it('append Entity Attributes. Attributes are overwritten 080', async function() {
        const overwrittenAttrs = {
            P1: {
                type: 'Property',
                value: 'Hola'
            },
            '@context': 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
        };
        const response = await http.post(`${entitiesResource}${entityId}/attrs/`, overwrittenAttrs, JSON_LD_HEADERS);
        expect(response.response).toHaveProperty('statusCode', 204);

        const checkResponse = await http.get(`${entitiesResource}${entityId}`, ACCEPT_LD);
        entity = patchObj(entity, overwrittenAttrs);
        assertRetrievedAlternatives(checkResponse, entity, 'application/ld+json', coreContexts);
    });

    it('append Entity Attributes. Attributes should not be overwritten. Partial success 081', async function() {
        const overwrittenAttrs = {
            P1: {
                type: 'Property',
                value: 'Hola'
            },
            P2: {
                type: 'Property',
                value: 'Adios'
            },
            '@context': 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
        };
        const response = await http.post(
            `${entitiesResource}${entityId}/attrs/?options=noOverwrite`,
            overwrittenAttrs,
            JSON_LD_HEADERS
        );
        expect(response.response).toHaveProperty('statusCode', 207);

        entity.P2 = overwrittenAttrs.P2;
        const checkResponse = await http.get(entitiesResource + entityId, ACCEPT_LD);
        assertRetrievedAlternatives(checkResponse, entity, 'application/ld+json', coreContexts);
    });
});
