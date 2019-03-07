# NGSI-LD Test Suite

This project is intended to define a test suite for [NGSI-LD](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/004/01.01.01_60/gs_CIM004v010101p.pdf),
the evolution of NGSIv2 for supporting Linked Data based on JSON-LD.

[![MIT license][license-image]][license-url]
[![Build badge](https://img.shields.io/travis/FIWARE/NGSI-LD_TestSuite.svg?branch=master "Travis build status")](https://travis-ci.org/FIWARE/NGSI-LD_TestSuite/?branch=master)
[![NGSI-LD badge](https://img.shields.io/badge/NGSI-LD-red.svg)](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.01.01_60/gs_CIM009v010101p.pdf)

## Test Summary

* [contextProvision. Section 5.6](./contextProvision)
* [contextConsumption. Section 5.7](./contextConsumption)
* [contextSubscription. Section 5.8](./contextSubscription)
* [contextSourceRegistration. Section 5.9](./contextSourceRegistration)
* [batchOperations. Section 5.6](./batchOperations)

## How to execute the tests

### Prerequisites 

* node version 10.9


```
npm install
export TEST_ENDPOINT=<Your NGSI-LD Broker endpoint>. Example: `http://localhost:1026`
export ACC_ENDPOINT=<The accumulator endpoint>. Example: `http://localhost:3000`
export NOTIFY_ENDPOINT=<The notification endpoint>. Example: `http://host.docker.internal:3000/acc`
npm test
```

By default, the test endpoint is `http://localhost:1026`.
By default, the accumulator endpoint is `http://localhost:3000`.
By default, the notification endpoint is the same as the accumulator endpoint. 

Please note, that if you are running the NGSI-LD endpoint through Docker, the endpoint shall be encoded as `http://host.docker.internal:<port>/acc`, so that the Docker container can get access to the accumulator server running on the host.  


[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

## See also

* https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/tree/master/schema
* https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/tree/master/examples
* https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/tree/master/spec/
