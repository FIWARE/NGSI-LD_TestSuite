var enppoint = process.env.TEST_ENDPOINT;
var ngsild = 'ngsi-ld/v1';

// Just to check an old NGSIv2 endpoint
if (process.env.FAKE_LD == 'yes') {
  ngsild = 'v2';
}

const testedResource = enppoint + '/' + ngsild;

module.exports.testedResource = testedResource;
