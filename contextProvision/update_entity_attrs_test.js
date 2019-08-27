const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {  
  const copy = JSON.parse(JSON.stringify(target));
  return Object.assign(copy, patch);
}

describe('Update Entity Attributes. JSON. Default @context', () => {
  const entity = {
    'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
    'type': 'T',
    'P1': {
      'type': 'Property',
      'value': 12,
      'observedAt': '2018-12-04T12:00:00.00Z',
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

  const updatedAttributes = {
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
  
  const entityId = encodeURIComponent(entity.id);

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entityId);
  });
  
    
  it('Partial success. Only P1 updated', async function() {
    const response = await http.patch(entitiesResource + entityId + '/attrs/', updatedAttributes);
    expect(response.response).toHaveProperty('statusCode', 207);
        
    const checkResponse = await http.get(entitiesResource + entityId);
        
    const finalEntity = patchObj(entity, {});
    finalEntity.P1 = updatedAttributes.P1;
    expect(checkResponse.body).toEqual(finalEntity);
    
    expect(checkResponse.body).toHaveProperty('updated', ['P1']);
    expect(checkResponse.body.notUpdated).toHaveLength(1);
    expect(response.body.notUpdated[0]).toHaveProperty('attributeName', 'location');
  });

    
  it('Target entity does not exist', async function() {
    const response = await http.patch(entitiesResource + 'urn:ngsi-ld:doesnotexist'
                                       + '/attrs/', updatedAttributes);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });

    
  it('Update Entity Attributes. Empty Payload', async function() {
    const response = await http.patch(entitiesResource + entityId
                                       + '/attrs/', {});
        
    expect(response.response).toHaveProperty('statusCode', 400);
  });

    
  it('All Attributes are overwritten', async function() {
    const overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      }
    };
    const response = await http.patch(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    const checkResponse = await http.get(entitiesResource + entityId);
    const finalEntity = patchObj(entity, overwrittenAttrs);
    
    expect(checkResponse.body).toEqual(finalEntity);
  });

  
  it('No Attribute known. 207', async function() {
    const overwrittenAttrs = {
      'P2': {
        'type': 'Property',
        'value': 'Hola'
      }
    };
    const response = await http.patch(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 207);
    
    expect(response.body).toHaveProperty('updated', []);
    expect(response.body.notUpdated).toHaveLength(1);
    expect(response.body.notUpdated[0]).toHaveProperty('attributeName', 'P2');
  });
  
});
