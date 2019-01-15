

const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const assertResultsQuery = require('../common.js').assertResultsQuery;
const serializeParams = require('../common.js').serializeParams;

describe('Query Entity. Geo. JSON. Default @context', () => {
  const entity1 = {
    'id': 'urn:ngsi-ld:City:Madrid',
    'type': 'T_City',
    'location': {
      'type': 'GeoProperty',
      'value': {
        'type': 'Point',
        'coordinates': [-3.691944, 40.418889]
      }
    }
  };
  
  const entity2 = {
    'id': 'urn:ngsi-ld:City:Leganes',
    'type': 'T_City',
    'location': {
      'type': 'GeoProperty',
      'value': {
        'type': 'Point',
        'coordinates': [-3.75, 40.316667]
      }
    }
  };

  const entity3 = {
    'id': 'urn:ngsi-ld:City:Alcobendas',
    'type': 'T_City',
    'location': {
      'type': 'GeoProperty',
      'value': {
        'type': 'Point',
        'coordinates': [-3.633333, 40.533333]
      }
    }
  };
  
  const entities = [entity1, entity2, entity3];
  const entityIds = [entity1.id, entity2.id, entity3.id];
  
  beforeAll(() => {
    let requests = [];
    
    for (let j = 0; j < entities.length; j++) {
      requests.push(http.post(entitiesResource,entities[j]));
    }
    
    return Promise.all(requests);
  });
    
  afterAll(() => {
    let requests = [];
    
    for (let j = 0; j < entityIds.length; j++) {
      requests.push(http.delete(entitiesResource + entityIds[j]));
    }
    
    return Promise.all(requests);
  });

  it('geoQuery near. Max Distance. No Results', async function() {
    const queryParams = {
      type: 'T_City',
      geometry: 'Point',
      coordinates: '[-3.691944, 40.418889]',
      georel: 'near;maxDistance==15'
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    
    assertResultsQuery(response, 0);
  });
  
  it('geoQuery near. Max Distance', async function() {
    const queryParams = {
      type: 'T_City',
      geometry: 'Point',
      coordinates: '[-3.691944, 40.418889]',
      georel: 'near;maxDistance==15000'
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    
    assertResultsQuery(response, 3);
  });
  
   it('geoQuery near. Min Distance. Only two results', async function() {
    const queryParams = {
      type: 'T_City',
      geometry: 'Point',
      coordinates: '[-3.691944, 40.418889]',
      georel: 'near;minDistance==1000'
    };
        
    const response = await http.get(entitiesResource + '?' + serializeParams(queryParams));
    
    assertResultsQuery(response, 2);
  });
  
});
