'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';

const JSON_LD_HEADERS = {
    'Content-Type': 'application/ld+json'
};

describe('Create Entity. JSON-LD @context', () => {
    it('should create an entity with JSON-LD @context as single URI', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I12345' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'TemporalProperty',
            'value': '2018-12-04T12:00:00'
          },
          'P2': {
            'type': 'GeoProperty',
            'value': {
                'type': 'Point',
                'coordinates': [-8, 40]
            }
          },
           'P1': {
            'type': 'Property',
            'value': 'Hola'
          },
          'R1': {
            'type': 'Relationship',
            'object': 'urn:ngsi-ld:T2:6789'
          },
          '@context': 'http://fiware.github.io/NGSI-LD_Tests/context/testContext.jsonld'
        };

        let response = await http.post(entitiesResource, entity, JSON_LD_HEADERS);
        expect(response.response).toHaveProperty('statusCode', 201);
    });

    it('should create an entity with JSON-LD @context as single URI', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I12345' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'TemporalProperty',
            'value': '2018-12-04T12:00:00'
          },
          'P2': {
            'type': 'GeoProperty',
            'value': {
                'type': 'Point',
                'coordinates': [-8, 40]
            }
          },
           'P1': {
            'type': 'Property',
            'value': 'Hola'
          },
          'R1': {
            'type': 'Relationship',
            'object': 'urn:ngsi-ld:T2:6789'
          },
          '@context': ['http://fiware.github.io/NGSI-LD_Tests/context/testContext.jsonld']
        };

        let response = await http.post(entitiesResource, entity, JSON_LD_HEADERS);
        expect(response.response).toHaveProperty('statusCode', 201);
    });

});
