const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {  
  const copy = JSON.parse(JSON.stringify(target));
  return Object.assign(copy, patch);
}

describe('Append Entity Attributes. JSON. Default @context', () => {
  const entity = {
    'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
    'type': 'T',
    'P1': {
      'type': 'Property',
      'value': 12,
      'observedAt': '2018-12-04T12:00:00Z',
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

  const appendedAttributes = {
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
  
  // The Entity Id has to be properly encoded
  const entityId = encodeURIComponent(entity.id);

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entityId);
  });
    
  it('append Entity Attributes', async function() {
    const response = await http.post(entitiesResource + entityId + '/attrs/', appendedAttributes);
        
    expect(response.response).toHaveProperty('statusCode', 204);
        
    const checkResponse = await http.get(entitiesResource + entityId);
        
    const finalEntity = patchObj(entity, appendedAttributes);
    expect(checkResponse.body).toEqual(finalEntity);
  });
    
  it('append Entity Attributes. Target entity does not exist', async function() {
    const response = await http.post(entitiesResource + 'urn:ngsi-ld:doesnotexist'
                                       + '/attrs/', appendedAttributes);
        
    expect(response.response).toHaveProperty('statusCode', 404);
  });
    
  it('append Entity Attributes. Empty Payload', async function() {
    const response = await http.post(entitiesResource + entityId
                                       + '/attrs/', {});
        
    expect(response.response).toHaveProperty('statusCode', 400);
  });
    
  it('append Entity Attributes. Attributes are overwritten', async function() {
    const overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      }
    };
    const response = await http.post(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    const checkResponse = await http.get(entitiesResource + entityId);
    const finalEntity = patchObj(entity, overwrittenAttrs);
    expect(checkResponse.body).toEqual(finalEntity);
  });
    
  it('append Entity Attributes. Attributes should not be overwritten. Partial success', async function() {
    const overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      },
      'P2': {
        'type': 'Property',
        'value': 'Adios'
      }
    };
    const response = await http.post(entitiesResource + entityId
                                       + '/attrs/?options=noOverwrite',
    overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 207);
        
    const finalEntity = patchObj(entity, {});
    finalEntity.P2 = overwrittenAttrs.P2;
    const checkResponse = await http.get(entitiesResource + entityId);     
    expect(checkResponse.body).toEqual(finalEntity);
  });
  
});
