const testedResource = require("../common.js").testedResource;
const http = require("../http.js");

const entitiesResource = testedResource + "/entities/";

const JSON_LD_HEADERS = {
  "Content-Type": "application/ld+json"
};

describe("Delete Entity Attribute. JSON-LD @context", () => {
  const entity = {
    id: "urn:ngsi-ld:T:" + new Date().getTime(),
    type: "T",
    P1: {
      type: "Property",
      value: "abcde"
    },
    "@context":
      "https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld"
  };

  const entityId = encodeURIComponent(entity.id);

  beforeAll(() => {
    return http.post(entitiesResource, entity, JSON_LD_HEADERS);
  });

  it("should not delete the entity attribute as @context does not match", async function() {
    const headers = {
      Link:
        '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.delete(
      entitiesResource + entityId + "/attrs/P1",
      headers
    );
    expect(response.response).toHaveProperty("statusCode", 404);
  });

  it("should delete the entity attribute as @context matches", async function() {
    const headers = {
      Link:
        '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };
    const response = await http.delete(
      entitiesResource + entityId + "/attrs/P1",
      headers
    );
    expect(response.response).toHaveProperty("statusCode", 204);
  });

  it("should return 404 if attribute does not exist even if @context matches", async function() {
    const headers = {
      Link:
        '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext2.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
    };

    const response = await http.delete(
      entitiesResource + entityId + "/attrs/P1",
      headers
    );
    expect(response.response).toHaveProperty("statusCode", 404);
  });
});
