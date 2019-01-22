const testedResource = require("../common.js").testedResource;
const assertRegistrationCreated = require("../common.js")
  .assertRegistrationCreated;
const http = require("../http.js");

const registrationsResource = testedResource + "/csourceRegistrations/";

describe("Create Registration. JSON", () => {
  it("should create registration from ETSI Example", async function() {
    const registration = {
      'id': 'urn:ngsi-ld:ContextSourceRegistration:csr1a3456',
      'type': 'ContextSourceRegistration',
      'information': [
        {
          'entities': [
            {
              'id': 'urn:ngsi-ld:Vehicle:A456',
              'type': 'Vehicle'
            }
          ],
          'properties': ['brandName', 'speed'],
          'relationships': ['isParked']
        },
        {
          'entities': [
            {
              'idPattern': '.*downtown$',
              'type': 'OffStreetParking'
            },
            {
              'idPattern': '.*47$',
              'type': 'OffStreetParking'
            }
          ],
          'properties': ['availableSotNumber', 'totalSpotNumber'],
          'relationships': ['isNextToBuilding']
        }
      ],
      'endpoint': 'http://my.csource.org:1026',
      'location': {
        type: 'Polygon',
        'coordinates': [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
        ]
      }
    };

    const response = await http.post(registrationsResource, registration);
    assertRegistrationCreated(response.response, registration.id);
  });
});
