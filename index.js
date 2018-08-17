var chakram = require('chakram'), expect = chakram.expect;

describe("Test API", function() {
    before("Create a new entity", function (done) {
      console.log('Before called!!!');
      
      let entity = {
          "id": "urn:ngsi-ld:T:I1234",
          "type": "T"
      };
        
      chakram.post("http://localhost:1026/v2/entities/fff", entity).then(() => { console.log('Done!!'); done(); },() => console.log('Error'));
        
      console.log('Before finished');
    });
  
    it("should retrieve the entity", function () {
      console.log('IT!!!');
      return chakram.get("http://localhost:1026/v2/entities/");
    });
    
    after("Delete Entity", function(done) {
      console.log('After called!!');
      chakram.delete("http://localhost:1026/v2/entities/urn:ngsi-ld:T:I1234").then(() => done());
    });
});
