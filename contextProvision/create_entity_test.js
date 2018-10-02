

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

  it('should create an entity. One TemporalProperty', async function() {
    const entity = {
      'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
      'type': 'T',
      'P1': {
        'type': 'TemporalProperty',
        'value': '2018-12-04T12:00:00'
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
        'observedAt': '2018-12-04T12:00:00'
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
        'observedAt': '2018-12-04T12:00:00'
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
        'observedAt': '2018-12-04T12:00:00',
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
        'observedAt': '2018-12-04T12:00:00',
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
