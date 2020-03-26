const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertResultsQuery = require('../common.js').assertResultsQuery;
const assertNoResultsQuery = require('../common.js').assertNoResultsQuery;
const serializeParams = require('../common.js').serializeParams;

const JSON_LD = /application\/ld\+json(;.*)?/;

const JSON_LD_HEADER_CONTEXT =
    '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContextPlusSchema.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

const ACCEPT_JSON_LD = {
    Accept: 'application/ld+json'
};

describe('Name prefixes test', () => {
    const entity = {
        id: 'urn:ngsi-ld:T:I123k467:Context',
        type: 'ex:T_Query',
        'ex:P100': {
            type: 'Property',
            value: 12
        },
        R100: {
            type: 'Relationship',
            object: 'urn:ngsi-ld:T2:6789'
        },
        'schema:name': {
            type: 'Property',
            value: 'XX'
        },
        '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContextPlusSchema.jsonld'
    };

    const entityId = encodeURIComponent(entity.id);

    beforeAll(() => {
        const JSON_LD_HEADERS = {
            'Content-Type': 'application/ld+json'
        };
        return http.post(entitiesResource, entity, JSON_LD_HEADERS);
    });

    afterAll(() => {
        return http.delete(entitiesResource + entityId);
    });

    it('query by type. Default @context. Not found as @context does not match. 011', async function() {
        const queryParams = {
            type: 'T_Query'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), ACCEPT_JSON_LD);
        assertNoResultsQuery(response, JSON_LD);
    });

    it('query by type. Right @context 012', async function() {
        const queryParams = {
            type: 'ex:T_Query'
        };

        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
        assertResultsQuery(response, 1);
    });

    it('query by condition over value. Default @context. Not found as @context does not match for the attribute. 012', async function() {
        const queryParams = {
            type: 'http://example.org/T_Query',
            q: 'P100>5'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), ACCEPT_JSON_LD);
        // Response here shall be JSON
        assertNoResultsQuery(response, JSON_LD);
    });

    it('query by condition over value. Right @context. 013', async function() {
        const queryParams = {
            type: 'http://example.org/T_Query',
            q: 'P100>5'
        };

        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
        assertResultsQuery(response, 1);
    });

    it('keeps schema:name as prefixed, as it clashes with Core @context name 014', async function() {
        const queryParams = {
            type: 'http://example.org/T_Query',
            q: 'P100>5'
        };

        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
        expect(response.body[0]).toBeDefined();
        expect(response.body[0]).toHaveProperty('schema:name.value', 'XX');
    });

    it('query by condition over prefixed attribute. Right @context. 015', async function() {
        const queryParams = {
            type: 'http://example.org/T_Query',
            q: 'schema:name=="XX"'
        };

        const headers = {
            Accept: 'application/ld+json',
            Link: JSON_LD_HEADER_CONTEXT
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
        assertResultsQuery(response, 1);
    });

    it('query by condition over prefixed attribute. No @context. 016', async function() {
        const queryParams = {
            type: 'http://example.org/T_Query',
            q: 'schema:name=="XX"'
        };

        const headers = {
            Accept: 'application/ld+json'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams), headers);
        assertNoResultsQuery(response, JSON_LD);
    });
});
