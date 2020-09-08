/*eslint no-console: "off"*/

const common = require('../common.js');

const testedResource = common.testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const accumulatorEndpoint = common.accEndpoint;
const accumulatorResource = accumulatorEndpoint + '/dump';
const clearAccumulatorResource = accumulatorEndpoint + '/clear';

const notifyEndpoint = common.notifyEndpoint;

const sleep = common.sleep;

const notifsCommon = require('./notification_common.js');

const createSubscription = notifsCommon.createSubscription;
const deleteSubscription = notifsCommon.deleteSubscription;

const assertNotification = notifsCommon.assertNotification;

describe('Basic Notification. JSON-LD @context', () => {
    // An entity is created
    const entity = {
        id: 'urn:ngsi-ld:Vehicle:V1234',
        type: 'Vehicle',
        speed: {
            type: 'Property',
            value: 34
        },
        brandName: {
            type: 'Property',
            value: 'Mercedes'
        }
    };

    const entityId = entity.id;

    // Accumulator is cleared before each test
    beforeEach(() => {
        const requests = [];
        requests.push(http.post(clearAccumulatorResource));
        // Entity is recreated to start from a known state
        requests.push(http.post(entitiesResource, entity));

        return Promise.all(requests);
    });

    afterEach(() => {
        return http.delete(entitiesResource + entityId);
    });

    it('should not send a notification. Subscription to Entity Type. LD Context generates a different mapping 163', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:test163',
            type: 'Subscription',
            entities: [
                {
                    type: 'Vehicle'
                }
            ],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            },
            '@context': 'https://fiware.github.io/NGSI-LD_TestSuite/ldContext/testFullContext.jsonld'
        };

        // Once subscription is created the first notification should be received
        await createSubscription(subscription, 'application/ld+json');

        await sleep(2000);

        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // No notification should be delivered as the @context will map Vehicle to a different URI
        assertNotification(accPayload, subscription.id, 0);

        await deleteSubscription(subscription.id);
    });
});
