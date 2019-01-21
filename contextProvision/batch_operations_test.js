const testedResource = require('../common.js').testedResource;
const assertCreated = require('../common.js').assertCreated;
const http = require('../http.js');

const batchCreationResource = testedResource + '/entityOperations/create';
const batchUpsertResource   = testedResource + '/entityOperations/upsert';
const batchUpdateResource   = testedResource + '/entityOperations/update';
const batchDeleteResource   = testedResource + '/entityOperations/delete';


describe('Batch Entity Creation. JSON', () => {
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
  
   
  it('should create a list of entities', async function() {
    const response = await http.post(batchCreationResource, [entity1, entity2]);
    
    expect(response.response).toHaveProperty('statusCode', 200);
  });
  
  
  it('should upsert a list of entities', async function() {
    // Default mode is replace (for upsert)
    const response = await http.post(batchUpsertResource, [entity1, entity2]);
    
    expect(response.response).toHaveProperty('statusCode', 200);
  });
  
  
  it('should update a list of entities', async function() {
    const entity11 = {
      'id': entity1.id,
      'type': 'T',
      'P100': {
        'type': 'Property',
        'value': 32
      }
    };

    const entity22 = {
      'id': entity2.id,
      'type': 'T',
      'P1': {
        'type': 'Property',
        'value': 'New value'
      }
    };
    
    // Entity 1 a new attribute P100 is appended
    // Entity 2 P1 will get a new value (default mode is overwrite)
    const response = await http.post(batchUpdateResource, [entity1, entity2]);
    
    expect(response.response).toHaveProperty('statusCode', 200);
  });
  
});
