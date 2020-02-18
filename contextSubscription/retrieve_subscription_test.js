const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';
const assertRetrieved = require('../common.js').assertRetrieved;

describe('Retrieve Subscription. JSON. Default @context', () => {
    const subscription = {
        id: 'urn:ngsi-ld:Subscription:mySubscription' + new Date().getTime(),
        type: 'Subscription',
        entities: [
            {
                type: 'Vehicle'
            }
        ],
        watchedAttributes: ['speed'],
        q: 'speed>50',
        geoQ: {
            georel: 'near;maxDistance==2000.0',
            geometry: 'Point',
            coordinates: [-1, 100]
        },
        notification: {
            attributes: ['speed'],
            format: 'keyValues',
            endpoint: {
                uri: 'http://my.endpoint.org/notify',
                accept: 'application/json'
            }
        }
    };

    const subscriptionId = encodeURIComponent(subscription.id);

    beforeAll(() => {
        return http.post(subscriptionsResource, subscription);
    });

    afterAll(() => {
        return http.delete(subscriptionsResource + subscriptionId);
    });

    it('should retrieve the subscription 145', async function() {
        const response = await http.get(subscriptionsResource + subscriptionId);
        assertRetrieved(response, subscription);
    });

    it('should report an error if the subscription does not exist 146', async function() {
        const response = await http.get(subscriptionsResource + encodeURIComponent('urn:ngsi-ld:xxxxxxx'));
        expect(response.response).toHaveProperty('statusCode', 404);
    });
});
