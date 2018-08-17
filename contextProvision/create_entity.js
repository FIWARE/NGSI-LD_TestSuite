var chakram = require('chakram'), expect = chakram.expect;
var testedResource = require('../common.js');

var entitiesResource = testedResource + "/" + "entities" + "/";

describe("Create Entity", function() {
    it("should create an empty entity", function () {
        let entity = {
          "id": "urn:ngsi-ld:T:I1234",
          "type": "T"
        };
       
        var response = chakram.post(entitiesResource,entity); 
        expect(response).to.have.status(201);
        
        return chakram.wait();
    });
    
    it("should create an entity. One Property", function () {
        let entity = {
          "id": "urn:ngsi-ld:T:I12345",
          "type": "T",
          "P1": {
            "type": "Property",
            "value": "Hola"
          }
        };
       
        var response = chakram.post(entitiesResource,entity); 
        expect(response).to.have.status(201);
        
        return chakram.wait();
    });
    
    it("should create an entity. Property. Relationship", function () {
        let entity = {
          "id": "urn:ngsi-ld:T:I12346",
          "type": "T",
          "P1": {
            "type": "Property",
            "value": "Hola"
          },
          "R1": {
            "type": "Relationship",
            "object": "urn:ngsi-ld:T2:6789"
          }
        };
       
        var response = chakram.post(entitiesResource,entity); 
        expect(response).to.have.status(201);
        
        return chakram.wait();
    });
    
});
