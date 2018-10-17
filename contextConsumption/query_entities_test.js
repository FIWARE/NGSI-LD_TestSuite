const testedResource = require("../common.js").testedResource;
const http = require("../http.js");

const entitiesResource = testedResource + "/entities/";
const assertRetrievedQuery = require("../common.js").assertRetrievedQuery;
const serializeParams = require("../common.js").serializeParams;

describe("Query Entity. JSON. Default @context", () => {
  const entity = {
    id: "urn:ngsi-ld:T_Query:EntityForQuery2345",
    type: "T_Query",
    P100: {
      type: "Property",
      value: 12,
      observedAt: "2018-12-04T12:00:00",
      P1_R1: {
        type: "Relationship",
        object: "urn:ngsi-ld:T2:6789"
      },
      P1_P1: {
        type: "Property",
        value: 0.79
      }
    },
    R100: {
      type: "Relationship",
      object: "urn:ngsi-ld:T2:6789",
      R1_R1: {
        type: "Relationship",
        object: "urn:ngsi-ld:T3:A2345"
      },
      R1_P1: {
        type: "Property",
        value: false
      }
    },
    location: {
      type: "GeoProperty",
      value: {
        type: "Point",
        coordinates: [-30.01, 75.01]
      }
    }
  };

  const entityId = encodeURIComponent(entity.id);

  beforeAll(() => {
    return http.post(entitiesResource, entity);
  });

  afterAll(() => {
    return http.delete(entitiesResource + entityId);
  });

  it("query by type", async function() {
    const queryParams = {
      type: "T_Query"
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });

  it("query by id", async function() {
    const queryParams = {
      id: entity.id
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });

  it("query by idPattern", async function() {
    const queryParams = {
      idPattern: ".*:T_Query:EntityForQuery.*"
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });

  it("query by condition over value", async function() {
    const queryParams = {
      id: entity.id,
      q: "P100>5"
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });

  it("query by condition over object", async function() {
    const queryParams = {
      id: entity.id,
      q: 'R100=="urn:ngsi-ld:T2:6789"'
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });

  it("query by condition over observedAt", async function() {
    const queryParams = {
      id: entity.id,
      q: "P100.observedAt>2018-12-03"
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });

  it("query by condition over property of property", async function() {
    const queryParams = {
      id: entity.id,
      q: "P100.P1_P1 > 0.70"
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });

  it("geoQuery near", async function() {
    const queryParams = {
      geometry: "Point",
      coordinates: "[-30,75]",
      georel: "near;maxDistance==3000"
    };

    const response = await http.get(
      entitiesResource + "?" + serializeParams(queryParams)
    );
    assertRetrievedQuery(response, entity);
  });
});
