

const testedResource = require('../common.js').testedResource;
const assertCreated = require('../common.js').assertCreated;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

describe('Create Entity. JSON', () => {
  it('should create an empty entity', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T'
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. One Property', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'P1': {
        'type': 'Property',
        'value': 'Hola'
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. One GeoProperty', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'location': {
        'type': 'GeoProperty',
        'value': {
          'type': 'Point',
          'coordinates': [-8, 40]
        }
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. One Property. DateTime', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'P1': {
        'type': 'Property',
        'value': {
          '@type': 'DateTime',
          '@value': '2018-12-04T12:00:00Z'
        }
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Property. Relationship', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
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

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Property. observedAt', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'P1': {
        'type': 'Property',
        'value': 12,
        'observedAt': '2018-12-04T12:00:00Z'
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Property. unitCode', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'P1': {
        'type': 'Property',
        'value': 12.45,
        'unitCode': 'm'
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Relationship. observedAt', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'R1': {
        'type': 'Relationship',
        'object': 'urn:ngsi-ld:T2:6789',
        'observedAt': '2018-12-04T12:00:00Z'
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Property. Property', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'P1': {
        'type': 'Property',
        'value': 12,
        'observedAt': '2018-12-04T12:00:00Z',
        'P1_P1': {
          'type': 'Property',
          'value': 0.89
        }
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });


  it('should create an entity. Relationship. Property', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
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

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Property. Relationship', async function() {
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
        }
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Relationship. Relationship', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
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

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });
  
  
  it('should create an entity. Structured Property Value', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'SP1': {
        'type': 'Property',
        'value': {
          'type': 'PostalAddress',
          'addressLocality': 'Berlin',
          'addressCountry': 'DE'
        }
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });
  
  it('should create an entity. Structured Property Value. Empty', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'SP1': {
        'type': 'Property',
        'value': {
        }
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });

  it('should create an entity. Array Property Value', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'AP1': {
        'type': 'Property',
        'value': [1,2,3,4]
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });
  
  it('should create an entity. Empty Array Property Value', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'AP1': {
        'type': 'Property',
        'value': []
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });
  
  it('should create an entity. Array Relationship Objects', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'AR1': {
        'type': 'Relationship',
        'object': ['urn:ngsi-ld:T:1234', 'urn:ngsi-ld:T:5678']
      }
    };

    const response = await http.post(entitiesResource, entity);
    assertCreated(response.response, entity.id);
  });
  
  it('should report an error if Entity already exists', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T'
    };

    await http.post(entitiesResource, entity);
    const response2 = await http.post(entitiesResource, entity);

    expect(response2.response).toHaveProperty('statusCode', 409);
  });
  
});
