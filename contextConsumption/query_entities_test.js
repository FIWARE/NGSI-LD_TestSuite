const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const assertRetrievedQuery = require('../common.js').assertRetrievedQuery;
const assertNoResultsQuery = require('../common.js').assertNoResultsQuery;
const serializeParams = require('../common.js').serializeParams;

describe('Query Entity. JSON. Default @context', () => {
    const entity = {
        id: 'urn:ngsi-ld:T_Query:EntityForQuery2345',
        type: 'T_Query',
        P100: {
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
        P1: {
            type: 'Property',
            value: 45
        },
        R100: {
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
                coordinates: [-30.01, 75.01]
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

    it('query by type 029', async function() {
        const queryParams = {
            type: entity.type
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by type. No results 030', async function() {
        const queryParams = {
            type: 'T_Non_Present'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertNoResultsQuery(response);
    });

    it('query by attributes. 031', async function() {
        const queryParams = {
            type: 'T_Query',
            attrs: 'P100'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        const result = {
            id: entity.id,
            type: entity.type,
            P100: entity.P100
        };

        assertRetrievedQuery(response, result);
    });

    it('query by id 032', async function() {
        const queryParams = {
            id: entity.id,
            type: entity.type
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by id. No results 033', async function() {
        const queryParams = {
            id: 'urn:ngsi-ld:T_Non_Present:890',
            type: entity.type
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertNoResultsQuery(response);
    });

    it('query by idPattern 034', async function() {
        const queryParams = {
            idPattern: '.*:T_Query:EntityForQuery.*',
            type: entity.type
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by idPattern. No results 035', async function() {
        const queryParams = {
            idPattern: '.*:T_Non_Present:EntityForQuery.*',
            type: entity.type
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertNoResultsQuery(response);
    });

    it('query by condition over value 036', async function() {
        const queryParams = {
            type: entity.type,
            q: 'P100>5'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by condition over value. No results 037', async function() {
        const queryParams = {
            type: entity.type,
            q: 'P100<=5'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertNoResultsQuery(response);
    });

    it('query by condition over values. And Condition 038', async function() {
        const queryParams = {
            type: entity.type,
            q: 'P100>5;P1>40'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by condition over values. Or Condition 039', async function() {
        const queryParams = {
            type: entity.type,
            q: 'P100>5|P1>50'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by condition over values. Parenthesis Association 040', async function() {
        const queryParams = {
            type: entity.type,
            q: '(P100>5|P1<=0);(P1>40|P1<=45)'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by condition over object 041', async function() {
        const queryParams = {
            type: entity.type,
            q: 'R100=="urn:ngsi-ld:T2:6789"'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by condition over observedAt 042', async function() {
        const queryParams = {
            type: entity.type,
            q: 'P100.observedAt>2018-12-03T12:00:00Z'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('query by condition over property of property 043', async function() {
        const queryParams = {
            type: entity.type,
            q: 'P100.P1_P1>0.70'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });

    it('geoQuery near 044', async function() {
        const queryParams = {
            type: entity.type,
            geometry: 'Point',
            coordinates: '[-30,75]',
            georel: 'near;maxDistance==3000'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
        assertRetrievedQuery(response, entity);
    });
});
