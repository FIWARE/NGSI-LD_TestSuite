const testedResource = require('../common.js').testedResource;
const assertBatchOperation = require('../common.js').assertBatchOperation;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const batchDeleteResource   = testedResource + '/entityOperations/delete';

describe('Batch Entity Deletion. JSON', () => {
  
  const entity1 = {
    'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
    'type': 'T'
  };

  const entity2 = {
    'id': 'urn:ngsi-ld:T:' + new Date().getTime(),
    'type': 'T',
    'P1': {
      'type': 'Property',
      'value': 'Hola'
    }
  };
  
  const entities = [
    entity1,
    entity2
  ];
  
  beforeAll(() => {
    const requests = [];
    
    for (let j = 0; j < entities.length; j++) {
      requests.push(http.post(entitiesResource,entities[j]));
    }
    
    return Promise.all(requests);
  });
   
  it('should delete a list of entities', async function() {
    const entityIds = [
      entity1.id,
      entity2.id
    ];
    
    const response = await http.post(batchDeleteResource, entityIds);
    
    expect(response.response).toHaveProperty('statusCode', 200);
    assertBatchOperation(response, entityIds, []);
  });
  
});
