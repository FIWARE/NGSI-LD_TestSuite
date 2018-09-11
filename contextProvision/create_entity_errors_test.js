'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';

describe('Create Entity. Errors. JSON', () => {
  it('should reject an entity which id is not a URI', async function() {
    let entity = {
      'id': 'abcdef',
      'type': 'T'
    };

    let response = await http.post(entitiesResource, entity);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject an entity which node type is not recognized', async function() {
    let entity = {
      'id': 'urn:ngsi-ld:T4:9000',
      'type': 'T',
      'P1': {
        'type': 'abcdef',
        'value': 34
      }
    };

    let response = await http.post(entitiesResource, entity);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject an entity with a property value equal to null', async function() {
    let entity = {
      'id': 'urn:ngsi-ld:T4:9000',
      'type': 'T',
      'P1': {
        'type': 'Property',
        'value': null
      }
    };

    let response = await http.post(entitiesResource, entity);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject an entity with a Relationship with no object', async function() {
    let entity = {
      'id': 'urn:ngsi-ld:T4:9000',
      'type': 'T',
      'R1': {
        'type': 'Relationship',
        'value': '1234'
      }
    };

    let response = await http.post(entitiesResource, entity);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject an entity with a Property with no value', async function() {
    let entity = {
      'id': 'urn:ngsi-ld:T4:9000',
      'type': 'T',
      'P1': {
        'type': 'Property',
        'object': '1234'
      }
    };

    let response = await http.post(entitiesResource, entity);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  it('should reject an entity with a Relationship object equal to null', async function() {
    let entity = {
      'id': 'urn:ngsi-ld:T4:9000',
      'type': 'T',
      'R1': {
        'type': 'Relationship',
        'object': null
      }
    };

    let response = await http.post(entitiesResource, entity);
    expect(response.response).toHaveProperty('statusCode', 400);
  });

  // TODO: Add here more tests (null values, etc.)
});
