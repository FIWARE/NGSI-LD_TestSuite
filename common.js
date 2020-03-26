/**
 *   Common utility functions. Probably in the future this would need a bit of refactoring
 *
 *   Copyright (c) 2018 FIWARE Foundation e.V.
 *
 *
 */

const endpoint = process.env.TEST_ENDPOINT || 'http://localhost:1026';

const accEndpoint = process.env.ACC_ENDPOINT || 'http://localhost:8080';
//const notifyEndpoint = process.env.NOTIFY_ENDPOINT || 'http://host.docker.internal:8080/acc';
const notifyEndpoint = process.env.NOTIFY_ENDPOINT || 'http://accumulator:8080/acc';

const ngsild = 'ngsi-ld/v1';

const testedResource = endpoint + '/' + ngsild;

// Regular expression for matching the link header pointing to the JSON-LD @context
const JSON_LD_CONTEXT_HEADER = /<.+>;\s+rel="http:\/\/www\.w3\.org\/ns\/json-ld#context";\s+type="application\/ld\+json"/;

const JSON_TYPE = /application\/json(;.*)?/;

const emptyArray = [];

const arrayWithAnEmptyObj = [{}];

const ACCEPTABLE_EMPTY_RESULTS = [emptyArray, arrayWithAnEmptyObj];

function acceptableContexts(entity, contexts) {
    const entities = [];
    contexts.forEach((context, index) => {
        const obj = JSON.parse(JSON.stringify(entity));
        obj['@context'] = context;
        entities.push(obj);
    });

    return entities;
}

function assertCreated(response, id, resource) {
    const resourceTest = resource || '/entities/';

    expect(response).toHaveProperty('statusCode', 201);
    expect(response.headers).toHaveProperty('location', '/' + ngsild + resourceTest + id);
}

function assertSubscriptionCreated(response, id) {
    assertCreated(response, id, '/subscriptions/');
}

function assertRegistrationCreated(response, id) {
    assertCreated(response, id, '/csourceRegistrations/');
}

function assertResponse(response, mimeType) {
    const mType = mimeType || JSON_TYPE;

    expect(response.response).toHaveProperty('statusCode', 200);
    expect(response.response.headers['content-type']).toMatch(mType);

    // response.response.headers['link'] =
    // '<http://json-ld.org/contexts/person.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

    if (mType === JSON_TYPE) {
        expect(response.response.headers.link).toBeDefined();
        const linkHeader = response.response.headers.link;
        expect(linkHeader).toMatch(JSON_LD_CONTEXT_HEADER);
    }
}

function assertRetrievedAlternatives(response, entity, mimeType, contexts) {
    const entities = acceptableContexts(entity, contexts);
    assertResponse(response, mimeType);
    expect(entities).toContainEqual(response.body);
}

function assertRetrieved(response, entity, mimeType) {
    assertResponse(response, mimeType);
    expect(response.body).toEqual(entity);
}
function assertRetrievedQueryAlternatives(response, entity, mimeType, contexts) {
    const entities = acceptableContexts(entity, contexts);
    assertResponse(response, mimeType);
    expect(response.body).toBeDefined();
    // Check first query result
    expect(response.body[0]).toBeDefined();
    expect(entities).toContainEqual(response.body[0]);
}
function assertRetrievedQuery(response, entity, mimeType) {
    assertResponse(response, mimeType);
    expect(response.body).toBeDefined();
    // Check first query result
    expect(response.body[0]).toBeDefined();
    expect(response.body[0]).toEqual(entity);
}

function assertNoResultsQuery(response, mimeType) {
    const checkedMimeType = mimeType || 'application/json';

    assertResponse(response, checkedMimeType);
    expect(response.body).toBeDefined();
    // Check first query result
    expect(ACCEPTABLE_EMPTY_RESULTS).toContainEqual(response.body);
    // expect(response.body.length).toBe(0);
}

function assertResultsQuery(response, numResults) {
    expect(response.body).toBeDefined();
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

function sleep(milliseconds) {
    /*eslint no-unused-vars: "off"*/
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}

module.exports = {
    testedResource,
    accEndpoint,
    notifyEndpoint,
    assertCreated,
    assertSubscriptionCreated,
    assertRegistrationCreated,
    assertRetrieved,
    assertRetrievedAlternatives,
    assertRetrievedQueryAlternatives,
    assertRetrievedQuery,
    assertResultsQuery,
    assertNoResultsQuery,
    serializeParams,
    assertBatchOperation,
    // TECHNICAL DEBT
    patchObj,
    sleep,
    assertResponse
};
