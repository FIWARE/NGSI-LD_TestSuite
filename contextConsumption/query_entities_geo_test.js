const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const assertResultsQuery = require('../common.js').assertResultsQuery;
const serializeParams = require('../common.js').serializeParams;

describe('Query Entity. Geo. JSON. Default @context', () => {
    const entity1 = {
        id: 'urn:ngsi-ld:City:Madrid',
        type: 'T_City',
        location: {
            type: 'GeoProperty',
            value: {
                type: 'Point',
                coordinates: [-3.691944, 40.418889]
            }
        }
    };

    const entity2 = {
        id: 'urn:ngsi-ld:City:Leganes',
        type: 'T_City',
        location: {
            type: 'GeoProperty',
            value: {
                type: 'Point',
                coordinates: [-3.75, 40.316667]
            }
        }
    };

    const entity3 = {
        id: 'urn:ngsi-ld:City:Alcobendas',
        type: 'T_City',
        location: {
            type: 'GeoProperty',
            value: {
                type: 'Point',
                coordinates: [-3.633333, 40.533333]
            }
        }
    };

    const entities = [entity1, entity2, entity3];
    const entityIds = [encodeURIComponent(entity1.id), encodeURIComponent(entity2.id), encodeURIComponent(entity3.id)];

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

    it('geoQuery near. Max Distance. No Results 022', async function() {
        const queryParams = {
            type: 'T_City',
            geometry: 'Point',
            coordinates: '[-3.691944,41.418889]',
            georel: 'near;maxDistance==15'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        assertResultsQuery(response, 0);
    });

    it('geoQuery near. Max Distance. The three results 023', async function() {
        const queryParams = {
            type: 'T_City',
            geometry: 'Point',
            coordinates: '[-3.691944,40.418889]',
            georel: 'near;maxDistance==15000'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        assertResultsQuery(response, 3);
    });

    it('geoQuery near. Max Distance. Only one result left 024', async function() {
        const queryParams = {
            type: 'T_City',
            geometry: 'Point',
            coordinates: '[-3.691944,40.418889]',
            georel: 'near;maxDistance==1000'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        assertResultsQuery(response, 1);
    });

    it('geoQuery near. Min Distance. Only two results 025', async function() {
        const queryParams = {
            type: 'T_City',
            geometry: 'Point',
            coordinates: '[-3.691944,40.418889]',
            georel: 'near;minDistance==1000'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        // Leganes and Alcobendas
        assertResultsQuery(response, 2);
    });

    it('geoQuery within a polygon 026', async function() {
        const queryParams = {
            type: 'T_City',
            geometry: 'Polygon',
            coordinates: '[[[-3.65,40.316667],[-3.85,40.416667],[-3.85,40.216667],[-3.65,40.316667]]]',
            georel: 'within'
        };

        const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));

        // Only Leganes
        assertResultsQuery(response, 1);
    });
});
