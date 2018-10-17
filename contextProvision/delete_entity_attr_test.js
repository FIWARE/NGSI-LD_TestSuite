const testedResource = require("../common.js").testedResource;
const http = require("../http.js");

const entitiesResource = testedResource + "/entities/";

describe("Delete Entity Attribute. Default @context", () => {
  const entity = {
    id: "urn:ngsi-ld:T:" + new Date().getTime(),
    type: "T",
    P1: {
      type: "Property",
      value: "abcde"
    }
  };

  const entityId = encodeURIComponent(entity.id);

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });

  it("should delete the entity attribute", async function() {
    const response = await http.delete(
      entitiesResource + entityId + "/attrs/P1"
    );
    expect(response.response).toHaveProperty("statusCode", 204);
  });

  it("should return 404 if attribute does not exist", async function() {
    const response = await http.delete(
      entitiesResource + entityId + "/attrs/P1"
    );
    expect(response.response).toHaveProperty("statusCode", 404);
  });
});
