# NGSI-LD Test Suite

This project is intended to define a test suite for [NGSI-LD](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/004/01.01.01_60/gs_CIM004v010101p.pdf),
the evolution of NGSIv2 for supporting Linked Data based on JSON-LD.

[![MIT license][license-image]][license-url]
[![Build badge](https://img.shields.io/travis/FIWARE/NGSI-LD_TestSuite.svg?branch=master "Travis build status")](https://travis-ci.org/FIWARE/NGSI-LD_TestSuite/?branch=master)
[![NGSI-LD badge](https://img.shields.io/badge/NGSI-LD-red.svg)](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.01.01_60/gs_CIM009v010101p.pdf)

## Test Summary

* [contextProvision. Section 5.6](./)
* [contextConsumption. Section 5.7](./contextConsumption)
* [contextSubscription. Section 5.8](./contextSubscription)
* [contextSourceRegistration. Section 5.9](./contextSourceRegistration)
* [batchOperations. Section 5.6](./batchOperations)

## How to execute the tests

### Prerequisites

* node version 10.17


```console
npm install
export TEST_ENDPOINT=<Your NGSI-LD Broker endpoint>. # Example: http://localhost:1026
export ACC_ENDPOINT=<The accumulator endpoint>. # Example: http://localhost:3000
export NOTIFY_ENDPOINT=<The notification endpoint>. # Example: http://host.docker.internal:3000/acc

# Start the accumulator and services under test - e.g. to start the docker-compose file
./services start

# Run the test suite
npm test
```

-  the test endpoint is `http://localhost:1026` By default
-  the accumulator endpoint is `http://localhost:8080` By default
-  the notification endpoint is `http://accumulator:8080/acc` By default

Please note, that if you are running the NGSI-LD accumulator endpoint locally,
ot can be referred to as  `http://host.docker.internal:<port>/acc`, so that  other Docker containers can get access to the accumulator server running on the host.

> **Note:** To run the accumulator locally you can start the service using
> ```console
> export WEB_APP_PORT=8080
> node accumulator/accumulator.js
> ```

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

## See also

* https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/tree/master/schema
* https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/tree/master/examples
* https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/tree/master/spec/
