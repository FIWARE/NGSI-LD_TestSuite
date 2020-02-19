const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';
const assertRetrievedAlternatives = require('../common.js').assertRetrievedAlternatives;

const JSON_LD = /application\/ld\+json(;.*)?/;

const JSON_LD_HEADERS_POST = {
    'Content-Type': 'application/ld+json'
};

const JSON_LD_HEADERS_GET = {
    Accept: 'application/ld+json'
};

describe('Retrieve Subscription. JSON-LD. @context', () => {
    const subscription = {
        id: 'urn:ngsi-ld:Subscription:mySubscription' + new Date().getTime(),
        type: 'Subscription',
        entities: [
            {
                type: 'T'
            }
        ],
        watchedAttributes: ['P1'],
        q: 'P1>50',
        geoQ: {
            georel: 'near;maxDistance==2000.0',
            geometry: 'Point',
            coordinates: [-1, 100]
        },
        notification: {
            attributes: ['P1'],
            format: 'keyValues',
            endpoint: {
                uri: 'http://my.endpoint.org/notify',
                accept: 'application/json'
            }
        },
        '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext.jsonld'
    };

    const testContexts = [
        'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testContext.jsonld',
        ['https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld']
    ];

    const subscriptionId = encodeURIComponent(subscription.id);

    beforeAll(() => {
        return http.post(subscriptionsResource, subscription, JSON_LD_HEADERS_POST);
    });

    afterAll(() => {
        return http.delete(subscriptionsResource + subscriptionId);
    });

    // Note - the testFullContext.json also includes the core context. This is not returned
    // in the subscription since it is assumed by default.
    it('should retrieve the subscription 147', async function() {
        const headers = {
            Accept: 'application/ld+json',
            Link:
                '<https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        };
        const response = await http.get(subscriptionsResource + subscriptionId, headers);
        assertRetrievedAlternatives(response, subscription, JSON_LD, testContexts);
    });

    it('should report an error if the subscription does not exist 148', async function() {
        const response = await http.get(
            subscriptionsResource + encodeURIComponent('urn:ngsi-ld:xxxxxxx'),
            JSON_LD_HEADERS_GET
        );
        expect(response.response).toHaveProperty('statusCode', 404);
    });
});
