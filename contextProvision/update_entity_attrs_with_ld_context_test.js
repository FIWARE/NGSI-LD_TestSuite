const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const JSON_LD_HEADERS = {
  'Content-Type': 'application/ld+json'
};

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {  
  const copy = JSON.parse(JSON.stringify(target));
  return Object.assign(copy, patch);
}

describe('Update Entity Attributes. JSON-LD @context', () => {
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
    },
    '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
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
    },
    '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
  };
  
  const entityId = encodeURIComponent(entity.id);

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entityId);
  });
    
  it('Update Entity Attributes. @context matches. Partial success', async function() {
    const response = await http.patch(entitiesResource + entityId + '/attrs/', updatedAttributes);
    expect(response.response).toHaveProperty('statusCode', 207); 
        
    const checkResponse = await http.get(entitiesResource + entityId, JSON_LD_HEADERS);
        
    const finalEntity = patchObj(entity, {});
    finalEntity.P1 = updatedAttributes.P1;
    
    expect(checkResponse.body).toEqual(finalEntity);
  });
  
  
  it('Update Entity Attributes. @context does not match', async function() {
    // @context is changed so now P1 points to a different FQN 
    const updatedAttrsCtx = patchObj(updatedAttributes, {
      '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld'
    });
    
    const response = await http.patch(entitiesResource + entityId + '/attrs/', updatedAttrsCtx);
    expect(response.response).toHaveProperty('statusCode', 207);
        
    const checkResponse = await http.get(entitiesResource + entityId, JSON_LD_HEADERS);
    expect(checkResponse.body).toEqual(entity);
  });  

    
  it('Update Entity Attributes. @context matches. All Attributes are overwritten', async function() {
    const overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      },
      '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
    };
    const response = await http.patch(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    const checkResponse = await http.get(entitiesResource + entityId);
    const finalEntity = patchObj(entity, overwrittenAttrs);
    
    expect(checkResponse.body).toEqual(finalEntity);
  });

  
  it('Update Entity Attributes. @context matches. No overwrite', async function() {
    const overwrittenAttrs = {
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      },
      '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
    };
    const response = await http.patch(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    expect(response.response).toHaveProperty('statusCode', 204);
        
    const checkResponse = await http.get(entitiesResource + entityId);
    const finalEntity = patchObj(entity, overwrittenAttrs);
    expect(checkResponse.body).toEqual(finalEntity);
  });
});