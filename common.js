var endpoint = process.env.TEST_ENDPOINT;
var ngsild = 'ngsi-ld/v1';

// Just to test an old NGSIv2 endpoint
if (process.env.FAKE_LD == 'yes') {
  ngsild = 'v2';
}

const testedResource = endpoint + '/' + ngsild;

const JSON = 'application/json';

// Regular expression for matching the link header pointing to the JSON-LD @context
const JSON_LD_CONTEXT_HEADER = /<.+>;\s+rel="http:\/\/www\.w3\.org\/ns\/json-ld#context";\s+type="application\/ld\+json"/;

function assertCreated(response, id) {
    expect(response).toHaveProperty('statusCode', 201);
    expect(response.headers).toHaveProperty('location', '/' + ngsild + '/entities/' + id);
}

function assertRetrieved(response, entity, mimeType) {
    let mType = mimeType || JSON;
    console.log('MIME Type', mType);

    expect(response.response).toHaveProperty('statusCode', 200);
    expect(response.response.headers).toHaveProperty('content-type', mType);

    // response.response.headers['link'] =
    // '<http://json-ld.org/contexts/person.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"';

    if (mType == JSON) {
      expect(response.response.headers['link']).toBeDefined();
      let linkHeader = response.response.headers['link'];
      expect(linkHeader).toMatch(JSON_LD_CONTEXT_HEADER);
    }

    expect(response.body).toEqual(entity);
}

module.exports = {
  testedResource: testedResource,
  assertCreated: assertCreated,
  assertRetrieved: assertRetrieved
};
