'use strict';

var endpoint = process.env.TEST_ENDPOINT;
var ngsild = 'ngsi-ld/v1';

// Just to test an old NGSIv2 endpoint
if (process.env.FAKE_LD == 'yes') {
  ngsild = 'v2';
}

const testedResource = endpoint + '/' + ngsild;

// Regular expression for matching the link header pointing to the JSON-LD @context
const JSON_LD_CONTEXT_HEADER = /<.+>;\s+rel="http:\/\/www\.w3\.org\/ns\/json-ld#context";\s+type="application\/ld\+json"/;

const JSON = /application\/json(;.*)?/;

function assertCreated(response, id) {
    expect(response).toHaveProperty('statusCode', 201);
    expect(response.headers).toHaveProperty('location', '/' + ngsild + '/entities/' + id);
}

function assertResponse(response, mimeType) {
  let mType = mimeType || JSON;

  expect(response.response).toHaveProperty('statusCode', 200);
  expect(response.response.headers['content-type']).toMatch(mType);

  // response.response.headers['link'] =
  // '<http://json-ld.org/contexts/person.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

  if (mType == JSON) {
      expect(response.response.headers['link']).toBeDefined();
      let linkHeader = response.response.headers['link'];
      expect(linkHeader).toMatch(JSON_LD_CONTEXT_HEADER);
  }
}

function assertRetrieved(response, entity, mimeType) {
    assertResponse(response, mimeType);
    expect(response.body).toEqual(entity);
}

function assertRetrievedQuery(response, entity, mimeType) {
  assertResponse(response, mimeType);
  // Check first query result
  expect(response.body[0]).toBeDefined();
  expect(response.body[0]).toEqual(entity);
}

function serializeParams(query) {
  let out = '';
  Object.keys(query).forEach(function(key) {
    out += key + '=' + encodeURIComponent(query[key]);
    out += '&';
  });

  return out.substring(0, out.length - 1);
}

module.exports = {
  testedResource: testedResource,
  assertCreated: assertCreated,
  assertRetrieved: assertRetrieved,
  assertRetrievedQuery: assertRetrievedQuery,
  serializeParams: serializeParams
};
