const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';
const serializeParams = require('../common.js').serializeParams;

describe('Query Entity. Errors', () => {
    it('Should raise error when Accept header does not imply application/json or application/ld+json. 005', async function() {
        const headers = {
            Accept: 'text/plain'
        };
        const response = await http.get(entitiesResource, headers);
        expect(response.response).toHaveProperty('statusCode', 406);
    });

    it('Should raise error when no entity type nor entity attributes provided. 017', async function() {
        const response = await http.get(entitiesResource);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('Should raise error when filter query is syntactically incorrect 018', async function() {
        const queryParams = {
            type: 'T_Query',
            q: 'a>>>4;c<<<5'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('Should raise error when geo query is syntactically incorrect. Bad georel 019', async function() {
        const queryParams = {
            type: 'T_Query',
            georel: 'invalid',
            geometry: 'Point',
            coordinates: '[-5,10]'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('Should raise error when geo query is syntactically incorrect. Bad geometry 020', async function() {
        const queryParams = {
            type: 'T_Query',
            georel: 'near;maxDistance==1000',
            geometry: 'xxxxx',
            coordinates: '[-5,10]'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('Should raise error when geo query is syntactically incorrect. Bad coordinates 021', async function() {
        const queryParams = {
            type: 'T_Query',
            georel: 'near;maxDistance==1000',
            geometry: 'Point',
            coordinates: '[-5]'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        expect(response.response).toHaveProperty('statusCode', 400);
    });
});
