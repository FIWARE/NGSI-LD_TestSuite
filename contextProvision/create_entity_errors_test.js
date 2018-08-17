'use strict';

var testedResource = require('../common.js').testedResource;
var http = require('../http.js');

var entitiesResource = testedResource + "/" + "entities" + "/";

describe('Create Entity. Errors. JSON', () => {
    it("should reject an entity which id is not a URI", async function () {
        let entity = {
          "id": "abcdef",
          "type": "T"
        };
        
        let response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });
    
    it("should reject an empty which node type is not recognized", async function () {
        let entity = {
          "id": "urn:ngsi-ld:T4:9000",
          "type": "T",
          "P1": {
            "type": "abcdef",
            "value": 34
          }
        };
        
        let response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 400);
    });
});
