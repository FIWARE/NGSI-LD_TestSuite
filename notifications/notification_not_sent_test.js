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
const notifCommon = require('./notification_common.js');
const createSubscription = notifCommon.createSubscription;
const deleteSubscription = notifCommon.deleteSubscription;
const updateAttribute = notifCommon.updateAttribute;
const assertNotification = notifCommon.assertNotification;

describe('Subscription yields to no Notification. JSON', () => {
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

    it('should not send a notification. Subscription to specific attribute. Update other 149', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    type: 'Vehicle'
                }
            ],
            watchedAttributes: ['speed'],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        // Once subscription is created the first notification should be received
        await createSubscription(subscription);

        // Now the brandName property is modified
        // No additional notification should be received
        await updateAttribute(entityId, 'brandName', 'Volvo');

        await sleep(2000);

        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification corresponding to the initial subscription shall be present
        assertNotification(accPayload, subscription.id, 0);

        await deleteSubscription(subscription.id);
    });

    it('should not send a notification. Subscription to entity which id does not match 150', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    type: 'Vehicle',
                    // Id will not match
                    id: entity.id + 'x'
                }
            ],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        // Here the initial notification should not be received as the query is not matched
        await createSubscription(subscription);

        // Now checking the content of the accumulator
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        assertNotification(accPayload, subscription.id, 0);

        await deleteSubscription(subscription.id);
    });

    it('should not send a notification. Subscription to idPattern does not match 151', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    type: 'Vehicle',
                    // idPattern will not match
                    idPattern: '.*:V4567'
                }
            ],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        // Here the initial notification should not be received as the query is not matched
        await createSubscription(subscription);

        // Now checking the content of the accumulator
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        assertNotification(accPayload, subscription.id, 0);

        await deleteSubscription(subscription.id);
    });

    it('should not send a notification. Subscription to entity which type does not match 152', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    // type will not match
                    type: 'Vehicle1',
                    id: entity.id
                }
            ],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        await createSubscription(subscription);

        // Now checking the content of the accumulator
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Entity id matches but entity type does not match ... so ... no notification
        assertNotification(accPayload, subscription.id, 0);

        await deleteSubscription(subscription.id);
    });

    it('should not send a notification. Watched attribute does not exist 153', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    // type will not match
                    type: 'Vehicle',
                    id: entity.id
                }
            ],
            watchedAttributes: ['doesNotExist'],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        await createSubscription(subscription);

        // Now checking the content of the accumulator
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Entity id matches but watched attributes not so no notification
        assertNotification(accPayload, subscription.id, 0);

        await deleteSubscription(subscription.id);
    });

    it('should not send a notification. Subscription is not active 154', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    // type will not match
                    type: 'Vehicle',
                    id: entity.id
                }
            ],
            isActive: false,
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        await createSubscription(subscription);

        // Now checking the content of the accumulator
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Entity id matches but watched attributes not so no notification
        assertNotification(accPayload, subscription.id, 0);

        await deleteSubscription(subscription.id);
    });

    it('should not send a notification. Subscription has expired 155', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    // type will not match
                    type: 'Vehicle',
                    id: entity.id
                }
            ],
            expires: new Date(new Date().getTime() + 1000).toISOString(),
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        // The initial notification should be received
        await createSubscription(subscription);

        // After one second subscription expires, so the notification shall not be delivered
        await sleep(2000);

        await updateAttribute(entityId, 'speed', 120);

        await sleep(2000);

        // Now checking the content of the accumulator
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification delivered as the subscription later had expired
        assertNotification(accPayload, subscription.id, 0);

        //await deleteSubscription(subscription.id);
    });
});
