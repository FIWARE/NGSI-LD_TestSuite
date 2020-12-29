//This file is used to check temporal create and update entity
const http = require('../http.js');

const testedResource = require('../common.js').testedResource;
const entitiesResource = testedResource+'/temporal/entities/';

const entity = {
    id: "urn:ngsi-ld:testunit:159",
    type: "AirQualityObserved",
    airQualityLevel: [
        {
               
            "type": "Property",
            "value": "moderate",
            "observedAt": "2018-08-14T12:00:00Z"
        },
        {
              
            "type": "Property",
            "value": "unhealthy",
            "observedAt": "2018-09-14T12:00:00Z"
        }
    ],
    "@context": [
        "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
    ]
};
describe('Create Temporal Entity. JSON', () => {
    it('should create an temporal entity 163', async function() {
        

        const response = await http.post(entitiesResource, entity);
        expect(response.response).toHaveProperty('statusCode', 201);
    });  

    it('should create an empty temporal entity 164', async function() {
        const entity1 ={
            "id": "urn:ngsi-ld:testunit:159",
            "type": "AirQualityObserved",
            "@context": [
                "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
            ]
        };

        const response = await http.post(entitiesResource, entity1);
        expect(response.response).toHaveProperty('statusCode', 201);
    });

    it('should create an entity with Bad request 165', async function() {
        const entity2 ={
            "ids": "urn:ngsi-ld:testunit:159",
            "type": "AirQualityObserved"
        };

        const response = await http.post(entitiesResource, entity2);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('update an existing temporal entity by ID 166', async function() {
    
        const response = await http.post(entitiesResource+'urn:ngsi-ld:testunit:159/attrs', entity);
        expect(response.response).toHaveProperty('statusCode', 204);
    });

    it('update an temporal entity by ID which is not exists 171', async function() {
    
        const response = await http.post(entitiesResource+'urn:ngsi-ld:testunit:1599/attrs', entity);
        expect(response.response).toHaveProperty('statusCode', 404);
    });

    it('try to update an existing temporal entity with no content found 167', async function() {
       
        const response = await http.patch(entitiesResource+'urn:ngsi-ld:testunit:159/attrs/airQuality/urn:ngsi-ld:2477ecaf-b79c-4d41-b0c9-c8ed09623d33', entity);
        expect(response.response).toHaveProperty('statusCode', 404);
    });   
});