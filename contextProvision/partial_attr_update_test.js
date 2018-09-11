'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';

describe('Partial Entity Attribute Update. JSON. Default @context', () => {
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
      },
      'P1_P1': {
        'type': 'Property',
        'value': 0.79
      }
    }
  };

  let partialUpdate = {
    'value': 55
  };

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entity.id);
  });
    
  it('Partial Attribute Update.', async function() {
    let response = await http.patch(entitiesResource + entity.id + '/' + 'attrs' + '/' + 'P1', partialUpdate);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    let checkResponse = await http.get(entitiesResource + entity.id);
        
    var finalEntity = Object.assign(entity, {});
    finalEntity['P1']['value'] = partialUpdate['value'];
    expect(checkResponse.body).toEqual(finalEntity);
  });
    
  it('Partial Attribute Update. Target entity does not exist', async function() {
    let response = await http.patch(entitiesResource + 'urn:ngsi-ld:doesnotexist'
                                       + '/' + 'attrs' + '/' + 'P1', partialUpdate);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });
    
  it('Partial Attribute Update. Target Attribute does not exist', async function() {
    let response = await http.patch(entitiesResource + entity.id
                                       + '/' + 'attrs' + '/' + 'NonExistentAttribute', partialUpdate);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });
    
  it('Partial Attribute Update. Empty Payload', async function() {
    let response = await http.patch(entitiesResource + entity.id
                                       + '/' + 'attrs' + '/' + 'P1', {});
        
    expect(response.response).toHaveProperty('statusCode', 400);
  });
});
