'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + '/' + 'entities' + '/';
var assertRetrievedQuery = require('../common.js').assertRetrievedQuery;
var serializeParams = require('../common.js').serializeParams;

describe('Query Entity. JSON. Default @context', () => {
  let entity = {
    'id': 'urn:ngsi-ld:T_Query:I123k467',
    'type': 'T_Query',
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
    },
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
        'coordinates': [-30.01, 75.01]
      }
    }
  };

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });
    
  afterAll(() => {
    return http.delete(entitiesResource + entity.id);
  });
   
  it('query by type', async function() {
    let queryParams = {
      type: 'T_Query',
    };
            
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response,entity); 
  });
   
  it('query by id', async function() {
    let queryParams = {
      id: entity.id  
    };
        
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response,entity);
  });
    
  it('query by idPattern', async function() {
    let queryParams = {
      idPattern: '.*:I123k467'
    };
        
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response, entity);
  });
    
  it('query by condition over value', async function() {
    let queryParams = {
      id: entity.id,  
      q: 'P1>5'  
    };
        
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response, entity);
  });
    
  it('query by condition over object', async function() {
    let queryParams = {
      id: entity.id,
      q: 'R1=="urn:ngsi-ld:T2:6789"'
    };
        
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response, entity);
  });
    
  it('query by condition over observedAt', async function() {
    let queryParams = {
      id: entity.id,
      q: 'P1.observedAt>2018-12-03'
    };
        
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response, entity);
  });
    
  it('query by condition over property of property', async function() {
    let queryParams = {
      id: entity.id,
      q: 'P1.P1_P1 > 0.70'
    };
        
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response, entity);
  });

  it('geoQuery near', async function() {
    let queryParams = {
      geometry: 'Point',
      coordinates: '[-30,75]',
      georel: 'near;maxDistance==3000'
    };
        
    let response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    assertRetrievedQuery(response, entity);
  }); 
});
