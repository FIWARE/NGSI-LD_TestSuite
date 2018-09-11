'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';

describe('Append Entity Attributes. JSON. Default @context', () => {
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

  let appendedAttributes = {
    'R1': {
      'type': 'Relationship',
      'object': 'urn:ngsi-ld:T2:6789',
      'R1_R1': {
        'type': 'Relationship',
        'object': 'urn:ngsi-ld:T3:A2345'
      },
      'R1_P1': {
        'type': 'Property',
        'value': false
      }
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
    
  it('append Entity Attributes', async function() {
    let response = await http.post(entitiesResource + entity.id + '/' + 'attrs' + '/', appendedAttributes);
        
    expect(response.response).toHaveProperty('statusCode', 204);
        
    let checkResponse = await http.get(entitiesResource + entity.id);
        
    var finalEntity = Object.assign(entity, appendedAttributes);
    expect(checkResponse.body).toEqual(finalEntity);
  });
    
  it('append Entity Attributes. Target entity does not exist', async function() {
    let response = await http.post(entitiesResource + 'urn:ngsi-ld:doesnotexist'
                                       + '/' + 'attrs' + '/', appendedAttributes);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });
    
  it('append Entity Attributes. Empty Payload', async function() {
    let response = await http.post(entitiesResource + entity.id
                                       + '/' + 'attrs' + '/', {});
        
    expect(response.response).toHaveProperty('statusCode', 400);
  });
    
  it('append Entity Attributes. Attributes are overwritten', async function() {
    let overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      }
    };
    let response = await http.post(entitiesResource + entity.id
                                       + '/' + 'attrs' + '/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    let checkResponse = await http.get(entitiesResource + entity.id);
    let finalEntity = Object.assign(entity, overwrittenAttrs);
    expect(checkResponse.body).toEqual(finalEntity);
  });
    
  it('append Entity Attributes. Attributes should not be overwritten. Partial success', async function() {
    let overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      },
      'P2': {
        'type': 'Property',
        'value': 'Adios'
      }
    };
    let response = await http.post(entitiesResource + entity.id
                                       + '/' + 'attrs' + '/' + '?options=noOverwrite',
    overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 207);
        
    let finalEntity = Object.assign(entity, {});
    finalEntity['P2'] = overwrittenAttrs['P2'];
    let checkResponse = await http.get(entitiesResource + entity.id);     
    expect(checkResponse.body).toEqual(finalEntity);
  }); 
});
