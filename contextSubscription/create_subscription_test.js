const testedResource = require('../common.js').testedResource;
const assertSubscriptionCreated = require('../common.js').assertSubscriptionCreated;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';

describe('Create Subscription. JSON', () => {
    it('should create subscription from ETSI Example 141', async function() {
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
                georel: 'near;maxDistance==2000',
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

        const response = await http.post(subscriptionsResource, subscription);
        assertSubscriptionCreated(response.response, subscription.id);
    });
});
