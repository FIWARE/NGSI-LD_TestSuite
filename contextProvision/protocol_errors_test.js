const testedResource = require("../common.js").testedResource;
const http = require("../http.js");

const entitiesResource = testedResource + "/entities/";

describe("NGSI-LD Protocol. Errors", () => {
  it("should reject content which is not JSON nor JSON-LD", async function() {
    const data = {
      id: "abcdef",
      type: "T"
    };

    const response = await http.post(entitiesResource, data, {
      "Content-Type": "image/gif"
    });
    expect(response.response).toHaveProperty("statusCode", 415);
  });

  // TODO: Add here more tests
});
