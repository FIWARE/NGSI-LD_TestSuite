'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';
var assertRetrievedQuery = require('../common.js').assertRetrievedQuery;

describe('Update Entity Attributes. JSON. Default @context', () => {
  let entity = {
    'id': 'urn:ngsi-ld:T:I123k467' + ':' + new Date().getTime(),
    'type': 'T',
    'P1': {
      'type': 'Property',
      'value': 12,
      'observedAt': '2018-12-04T12:00:00.00',
      'P1_R1': {
        'type': 'Relationship',
        'object': 'urn:ngsi-ld:T2:6789'
      },
      'P1_P1': {
        'type': 'Property',
        'value': 0.79
      }
    }
  };

  let updatedAttributes = {
    'P1': {
      'type': 'Relationship',
      'object': 'urn:ngsi-ld:T2:6789'
    },
    'location': {
      'type': 'GeoProperty',
      'value': {
        'type': 'Point',
        'coordinates': [-8.01, 40.01]
      }
    }
  };

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entity.id);
  });
    
  it('Update Entity Attributes. Partial success', async function() {
    let response = await http.patch(entitiesResource + entity.id + '/' + 'attrs' + '/', updatedAttributes);
    expect(response.response).toHaveProperty('statusCode', 207);
        
    let checkResponse = await http.get(entitiesResource + entity.id);
        
    var finalEntity = Object.assign(entity, {});
    finalEntity['P1'] = updatedAttributes['P1'];
    expect(checkResponse.body).toEqual(finalEntity);
  });
    
  it('Update Entity Attributes. Target entity does not exist', async function() {
    let response = await http.patch(entitiesResource + 'urn:ngsi-ld:doesnotexist'
                                       + '/' + 'attrs' + '/', updatedAttributes);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });
    
  it('Update Entity Attributes. Empty Payload', async function() {
    let response = await http.patch(entitiesResource + entity.id
                                       + '/' + 'attrs' + '/', {});
        
    expect(response.response).toHaveProperty('statusCode', 400);
  });
    
  it('Update Entity Attributes. All Attributes are overwritten', async function() {
    let overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      }
    };
    let response = await http.patch(entitiesResource + entity.id
                                       + '/' + 'attrs' + '/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    let checkResponse = await http.get(entitiesResource + entity.id);
    let finalEntity = Object.assign(entity, overwrittenAttrs);
    expect(checkResponse.body).toEqual(finalEntity);
  });
});
