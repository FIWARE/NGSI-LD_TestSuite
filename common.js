/**
 *   Common utility functions. Probably in the future this would need a bit of refactoring
 *
 *   Copyright (c) 2018 FIWARE Foundation e.V.
 *
 *
 */

const endpoint = process.env.TEST_ENDPOINT;
const ngsild = 'ngsi-ld/v1';

const testedResource = endpoint + '/' + ngsild;

// Regular expression for matching the link header pointing to the JSON-LD @context
const JSON_LD_CONTEXT_HEADER = /<.+>;\s+rel="http:\/\/www\.w3\.org\/ns\/json-ld#context";\s+type="application\/ld\+json"/;

const JSON = /application\/json(;.*)?/;

function assertCreated(response, id, resource) {
  const resourceTest = resource || '/entities/';
  
  expect(response).toHaveProperty('statusCode', 201);
  expect(response.headers).toHaveProperty('location', '/' + ngsild + resourceTest + id);
}

function assertSubscriptionCreated(response, id) {
  assertCreated(response,id,'/subscriptions/');
}

function assertResponse(response, mimeType) {
  const mType = mimeType || JSON;

  expect(response.response).toHaveProperty('statusCode', 200);
  expect(response.response.headers['content-type']).toMatch(mType);

  // response.response.headers['link'] =
  // '<http://json-ld.org/contexts/person.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

  if (mType === JSON) {
    expect(response.response.headers.link).toBeDefined();
    const linkHeader = response.response.headers.link;
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

function assertNoResultsQuery(response, mimeType) {
  const checkedMimeType = mimeType || 'application/json';
  
  assertResponse(response, checkedMimeType);
  // Check first query result
  expect(response.body.length).toBe(0);
}

function assertResultsQuery(response, numResults) {
  expect(response.body.length).toBe(numResults);
}

function assertBatchOperation(response, success, errors) {
  expect(typeof response.body).toBe('object');
  
  const respSuccess = response.body.success;
  const respErrors = response.body.errors;
  
  expect(respSuccess.length).toBe(success.length);
  expect(respErrors.length).toBe(errors.length);
  
  for (let j = 0; j < success.length; j++) {
    expect(respSuccess[j]).toBe(success[j]);
  }
  
  for (let j = 0; j < errors.length; j++) {
    expect(respErrors[j].entityId).toBe(errors[j]);
  }
}

function serializeParams(query) {
  let out = '';
  Object.keys(query).forEach(function(key) {
    out += key + '=' + encodeURIComponent(query[key]);
    out += '&';
  });

  return out.substring(0, out.length - 1);
}

// Patches the object and returns a new copy of the patched object
// For some reason when invoking this function from the tests the JSON
// global object is not found
// TECHNICAL DEBT
function patchObj(target, patch) {
  const copy = JSON.parse(JSON.stringify(target));
  return Object.assign(copy, patch);
}

function wait(milliseconds) {
  var sab = new SharedArrayBuffer(4);
  var int32 = new Int32Array(sab);
  
  Atomics.wait(int32, 0, 0, milliseconds);
}

module.exports = {
  testedResource,
  assertCreated,
  assertSubscriptionCreated,
  assertRetrieved,
  assertRetrievedQuery,
  assertResultsQuery,
  assertNoResultsQuery,
  serializeParams,
  assertBatchOperation,
  // TECHNICAL DEBT
  patchObj,
  wait
};
