# NGSI-LD Test Suite

This project is intended to define a test suite for NGSI-LD , the evolution of NGSIv2 for supporting linked data based on JSON-LD.

[![MIT license][license-image]][license-url]

[![Build badge](https://img.shields.io/travis/Fiware/NGSI-LD_Tests.svg?branch=master "Travis build status")](https://travis-ci.org/Fiware/NGSI-LD_Tests/?branch=master)

[![NGSI-LD badge](https://img.shields.io/badge/NGSI-LD-red.svg)](http://www.etsi.org/deliver/etsi_gs/CIM/001_099/004/01.01.01_60/gs_CIM004v010101p.pdf)


## How to execute the tests

### Prerequisites 

* node version 10.9


```
npm install
export TEST_ENDPOINT=<Your NGSI-LD Broker end point>. Example: `http://localhost:1026`
npm test
```
