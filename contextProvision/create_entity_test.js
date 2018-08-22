'use strict';

var testedResource = require('../common.js').testedResource;
var assertCreated = require('../common.js').assertCreated;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';

describe('Create Entity. JSON', () => {
    it('should create an empty entity', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I1234' + ':' + new Date().getTime(),
          'type': 'T'
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. One Property', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I12345' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'Property',
            'value': 'Hola'
          }
        };

        let response = await http.post(entitiesResource, entity);
         assertCreated(response.response, entity.id);
    });

    it('should create an entity. One GeoProperty', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I12345' + ':' + new Date().getTime(),
          'type': 'T',
          'location': {
            'type': 'GeoProperty',
            'value': {
                'type': 'Point',
                'coordinates': [-8, 40]
            }
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. One TemporalProperty', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I12345' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'TemporalProperty',
            'value': '2018-12-04T12:00:00'
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. Relationship', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I12346' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'Property',
            'value': 'Hola'
          },
          'R1': {
            'type': 'Relationship',
            'object': 'urn:ngsi-ld:T2:6789'
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. observedAt', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I123467' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'Property',
            'value': 12,
            'observedAt': '2018-12-04T12:00:00'
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. unitCode', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I123467' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'Property',
            'value': 12.45,
            'unitCode': 'm'
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Relationship. observedAt', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
          'type': 'T',
          'R1': {
            'type': 'Relationship',
            'object': 'urn:ngsi-ld:T2:6789',
            'observedAt': '2018-12-04T12:00:00'
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. Property', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'Property',
            'value': 12,
            'observedAt': '2018-12-04T12:00:00',
            'P1_P1': {
                'type': 'Property',
                'value': 0.89
            }
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });


    it('should create an entity. Relationship. Property', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
          'type': 'T',
          'R1': {
            'type': 'Relationship',
            'object': 'urn:ngsi-ld:T2:6789',
            'R1_P1': {
                'type': 'Property',
                'value': 'V'
            }
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Property. Relationship', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
          'type': 'T',
          'P1': {
            'type': 'Property',
            'value': 12,
            'observedAt': '2018-12-04T12:00:00',
            'P1_R1': {
                'type': 'Relationship',
                'object': 'urn:ngsi-ld:T2:6789'
            }
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });

    it('should create an entity. Relationship. Relationship', async function() {
        let entity = {
          'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
          'type': 'T',
          'R1': {
            'type': 'Relationship',
            'object': 'urn:ngsi-ld:T2:6789',
            'R1_R1': {
                'type': 'Relationship',
                'object': 'urn:ngsi-ld:T3:A2345'
            }
          }
        };

        let response = await http.post(entitiesResource, entity);
        assertCreated(response.response, entity.id);
    });
});
