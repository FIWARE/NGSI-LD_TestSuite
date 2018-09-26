

const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

describe('Partial Entity Attribute Update. JSON. Default @context', () => {
  const entity = {
    'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
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

  const partialUpdate = {
    'value': 55
  };

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entity.id);
  });
    
  it('Partial Attribute Update.', async function() {
    const response = await http.patch(entitiesResource + entity.id + '/attrs/P1', partialUpdate);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    const checkResponse = await http.get(entitiesResource + entity.id);
        
    const finalEntity = Object.assign(entity, {});
    finalEntity.P1.value = partialUpdate.value;
    expect(checkResponse.body).toEqual(finalEntity);
  });
    
  it('Partial Attribute Update. Target entity does not exist', async function() {
    const response = await http.patch(entitiesResource + 'urn:ngsi-ld:doesnotexist'
                                       + '/attrs/P1', partialUpdate);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });
    
  it('Partial Attribute Update. Target Attribute does not exist', async function() {
    const response = await http.patch(entitiesResource + entity.id
                                       + '/attrs/NonExistentAttribute', partialUpdate);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });
    
  it('Partial Attribute Update. Empty Payload', async function() {
    const response = await http.patch(entitiesResource + entity.id
                                       + '/attrs/P1', {});
        
    expect(response.response).toHaveProperty('statusCode', 400);
  });
});
