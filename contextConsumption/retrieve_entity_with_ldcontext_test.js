const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertRetrievedAlternatives = require('../common.js').assertRetrievedAlternatives;
const assertRetrieved = require('../common.js').assertRetrieved;

const JSON_LD = /application\/ld\+json(;.*)?/;
const PLAIN_JSON = /application\/json(;.*)?/;

const JSON_LD_HEADERS_POST = {
    'Content-Type': 'application/ld+json'
};

const JSON_LD_HEADER_CONTEXT =
    '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {
    const copy = JSON.parse(JSON.stringify(target));
    return Object.assign(copy, patch);
}

describe('Retrieve Entity. JSON-LD. @context ', () => {
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
        },
        '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext.jsonld'
    };

    const entityId = encodeURIComponent(entity.id);

    // Entity key Values
    const entityKeyValues = {
        id: entity.id,
        type: entity.type,
        P1: entity.P1.value,
        R1: entity.R1.object,
        '@context': entity['@context']
    };

    // Entity projection only one attribute
    const entityOneAttr = {
        id: entity.id,
        type: entity.type,
        P1: entity.P1,
        '@context': entity['@context']
    };

    const entityNoAttr = {
        id: entity.id,
        type: entity.type,
        '@context': entity['@context']
    };

    const entityNoContext = patchObj({}, entity);
    delete entityNoContext['@context'];

    // The same Entity but compacted using an alternative @context
    const entityAltCompacted = {
        id: entity.id,
        type: 'AltT',
        AltP1: {
            type: 'Property',
            value: 12,
            observedAt: '2018-12-04T12:00:00Z',
            AltP1_R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T2:6789'
            },
            AltP1_P1: {
                type: 'Property',
                value: 0.79
            }
        },
        AltR1: {
            type: 'Relationship',
            object: 'urn:ngsi-ld:T2:6789',
            AltR1_R1: {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T3:A2345'
            },
            AltR1_P1: {
                type: 'Property',
                value: false
            }
        },
        '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/alternativeContext.jsonld'
    };

    const entityNotCompacted = {
        id: entity.id,
        type: 'http://example.org/T',
        'http://example.org/P1': {
            type: 'Property',
            value: 12,
            observedAt: '2018-12-04T12:00:00Z',
            'http://example.org/P1_R1': {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T2:6789'
            },
            'http://example.org/P1_P1': {
                type: 'Property',
                value: 0.79
            }
        },
        'http://example.org/R1': {
            type: 'Relationship',
            object: 'urn:ngsi-ld:T2:6789',
            'http://example.org/R1_R1': {
                type: 'Relationship',
                object: 'urn:ngsi-ld:T3:A2345'
            },
            'http://example.org/R1_P1': {
                type: 'Property',
                value: false
            }
        },
        '@context': 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
    };

    const coreContexts = [
        'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
        ['https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld']
    ];

    const altContexts = [
        'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/alternativeContext.jsonld',
        [
            'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/alternativeContext.jsonld',
            'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
        ]
    ];

    const testContexts = [
        'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext.jsonld',
        ['https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld']
    ];

    beforeAll(() => {
        return http.post(entitiesResource, entity, JSON_LD_HEADERS_POST);
    });

    afterAll(() => {
        return http.delete(entitiesResource + entityId);
    });

    it('should retrieve the entity. application/ld+json MIME Type Accepted. JSON-LD 057', async function() {
        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrievedAlternatives(response, entity, JSON_LD, testContexts);
    });

    it('should retrieve the entity. (non-present accept header). JSON 058', async function() {
        const headers = {
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrieved(response, entityNoContext, PLAIN_JSON);
    });

    it('should retrieve the entity. Any Media Type Accepted. JSON-LD 059', async function() {
        const headers = {
            Accept: '*/*',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrievedAlternatives(response, entity, JSON_LD, testContexts);
    });

    it('should retrieve the entity. Any application/* Media Type Accepted. JSON-LD 060', async function() {
        const headers = {
            Accept: 'application/*',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrievedAlternatives(response, entity, JSON_LD, testContexts);
    });

    it('should retrieve the entity. application/json MIME Type Accepted. JSON 061', async function() {
        const headers = {
            Accept: 'application/json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrieved(response, entityNoContext, PLAIN_JSON);
    });

    it('should retrieve the entity. application/ld+json MIME Type Accepted. JSON-LD 062', async function() {
        const headers = {
            Accept: 'application/ld+json, application/json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrievedAlternatives(response, entity, JSON_LD, testContexts);
    });

    it('should retrieve the entity. application/json MIME Type wins as it is more specific. JSON 063', async function() {
        const headers = {
            Accept: '*/*, application/json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrieved(response, entityNoContext, PLAIN_JSON);
    });

    it('should retrieve the entity. application/json MIME Type wins as it is more specific. JSON 064', async function() {
        const headers = {
            Accept: 'application/*, application/json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrieved(response, entityNoContext, PLAIN_JSON);
    });

    it('should retrieve the entity. application/ld+json MIME Type expanded from range. JSON-LD 065', async function() {
        const headers = {
            Accept: 'text/plain, application/*',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrievedAlternatives(response, entity, JSON_LD, testContexts);
    });

    it('should retrieve the entity. application/json MIME Type wins as it has more weight. JSON 066', async function() {
        const headers = {
            Accept: 'application/json, application/ld+json; q=0.8',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId, headers);
        assertRetrieved(response, entityNoContext, PLAIN_JSON);
    });

    it('should retrieve the entity key values mode 067', async function() {
        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId + '?options=keyValues', headers);
        assertRetrievedAlternatives(response, entityKeyValues, JSON_LD, testContexts);
    });

    it('should retrieve the entity attribute projection 068', async function() {
        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId + '?attrs=P1', headers);
        assertRetrievedAlternatives(response, entityOneAttr, JSON_LD, testContexts);
    });

    it('should retrieve the entity no attribute matches 069', async function() {
        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };
        const response = await http.get(entitiesResource + entityId + '?attrs=notFoundAttr', headers);
        assertRetrievedAlternatives(response, entityNoAttr, JSON_LD, testContexts);
    });

    it('should retrieve the entity no attribute matches as @context differs 070', async function() {
        const headers = {
            Accept: 'application/ld+json',
            // Observe that the provided @context will make the attribute not to match
            Link:
                '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        };
        const expectedEntityNoAttr = {
            id: entity.id,
            type: 'http://example.org/T',
            '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld'
        };

        const testContext2 = [
            'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld',
            [
                'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld',
                'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld'
            ]
        ];

        const response = await http.get(entitiesResource + entityId + '?attrs=P1', headers);
        assertRetrievedAlternatives(response, expectedEntityNoAttr, JSON_LD, testContext2);
    });

    it('should retrieve the entity but compaction shall use an alternative @context 071', async function() {
        const headers = {
            Accept: 'application/ld+json',
            Link:
                '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/alternativeContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        };

        const response = await http.get(entitiesResource + entityId, headers);

        assertRetrievedAlternatives(response, entityAltCompacted, JSON_LD, altContexts);
    });

    it('should retrieve the entity but as no @context provided compaction should not happen 072', async function() {
        const headers = {
            Accept: 'application/ld+json'
        };

        const response = await http.get(entitiesResource + entityId, headers);

        assertRetrievedAlternatives(response, entityNotCompacted, JSON_LD, coreContexts);
    });
});
