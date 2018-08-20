var enppoint = process.env.TEST_ENDPOINT;
var ngsild = 'ngsi-ld/v1';

// Just to test an old NGSIv2 endpoint
if (process.env.FAKE_LD == 'yes') {
  ngsild = 'v2';
}

const testedResource = enppoint + '/' + ngsild;

function assertCreated(response, id) {
    expect(response).toHaveProperty('statusCode', 201);
    expect(response.headers).toHaveProperty('location', '/' + ngsild + '/entities/' + id);
}

module.exports = {
  testedResource: testedResource,
  assertCreated: assertCreated
};
