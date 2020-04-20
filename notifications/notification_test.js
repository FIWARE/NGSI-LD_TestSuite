/*eslint no-console: "off"*/

const common = require('../common.js');

const testedResource = common.testedResource;
const http = require('../http.js');

const entitiesResource = testedResource + '/entities/';

const accumulatorEndpoint = common.accEndpoint;
const accumulatorResource = accumulatorEndpoint + '/dump';
const clearAccumulatorResource = accumulatorEndpoint + '/clear';

const notifyEndpoint = common.notifyEndpoint; // 'http://host.docker.internal:3000/acc'; //

const sleep = common.sleep;

const notifCommon = require('./notification_common.js');

const createSubscription = notifCommon.createSubscription;
const deleteSubscription = notifCommon.deleteSubscription;
const updateAttribute = notifCommon.updateAttribute;

const assertNotification = notifCommon.assertNotification;
const assertNotificationContent = notifCommon.assertNotificationContent;
const assertNotificationNoContent = notifCommon.assertNotificationNoContent;

describe('Basic Notification. JSON', () => {
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
        //requests.push(http.post(entitiesResource, entity));

        return Promise.all(requests);
    });

    afterEach(() => {
        return http.delete(entitiesResource + entityId);
    });

    it('should send a notification. Subscription to Entity Type. Any attribute 156', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
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
            }
        };

        // Once subscription is created the first notification should be received
        await createSubscription(subscription);
		await http.post(entitiesResource, entity);
        await sleep(2000);

        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification corresponding to the initial subscription
        assertNotification(accPayload, subscription.id, 1);
        const entityValue = {
            entityId,
            index: 0,
            attribute: 'speed',
            value: entity.speed.value
        };
        assertNotificationContent(accPayload, subscription.id, entityValue);

        await deleteSubscription(subscription.id);
    });

    it('should send a notification. Subscription to Entity Type. Any attribute watched. Only one attribute delivered 157', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
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
                },
                attributes: ['brandName']
            }
        };

        // Once subscription is created the first notification should be received
        await createSubscription(subscription);

        await http.post(entitiesResource, entity);
        await sleep(2000);


        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification corresponding to the initial subscription
        assertNotification(accPayload, subscription.id, 1);

        const entityValue = {
            entityId,
            index: 0,
            attribute: 'brandName',
            value: entity.brandName.value
        };
        assertNotificationContent(accPayload, subscription.id, entityValue);

        // speed attribute should not have been received
        assertNotificationNoContent(accPayload, subscription.id, {
            entityId,
            index: 0,
            attribute: 'speed'
        });

        await deleteSubscription(subscription.id);
    });

    it('should send a notification. Subscription to Entity Type. Any attribute watched. Non existent attribute asked 158', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
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
                },
                attributes: ['doesNotExist']
            }
        };

        // Once subscription is created the first notification should be received
        await createSubscription(subscription);

        await http.post(entitiesResource, entity);
        await sleep(2000);


        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification corresponding to the initial subscription
        assertNotification(accPayload, subscription.id, 0);

        assertNotificationNoContent(accPayload, subscription.id, {
            entityId: entity.id,
            index: 0,
            attribute: 'speed'
        });

        assertNotificationNoContent(accPayload, subscription.id, {
            entityId: entity.id,
            index: 0,
            attribute: 'brandName'
        });

        await deleteSubscription(subscription.id);
    });

    it('should send a notification. Simple subscription to concrete attribute. Subsequent update 159', async function() {
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
		await http.post(entitiesResource, entity);
        
        // Now the speed property is modified
        // An additional notification should be received
        const newSpeed = 5;
        await updateAttribute(entityId, 'speed', newSpeed);

        await sleep(2000);
		const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Two notifications one corresponding to the initial subscription another corresponding to
        // The update of the speed attribute
        assertNotification(accPayload, subscription.id, 2);

        assertNotificationContent(accPayload, subscription.id, {
            entityId,
            index: 1,
            attribute: 'speed',
            value: newSpeed
        });

        await deleteSubscription(subscription.id);
    });

    it('should send a notification. Simple subscription to entity id 160', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    id: entityId,
                    type: 'Vehicle'
                }
            ],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        // Once subscription is created the first notification should be received
        await createSubscription(subscription);
		await http.post(entitiesResource, entity);
        await sleep(2000);

        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification corresponding to the initial subscription
        // Only one notification corresponding to the initial subscription
        assertNotification(accPayload, subscription.id, 1);

        // Only one notification as it should only be sent when the filter conditions are met
        assertNotificationContent(accPayload, subscription.id, {
            entityId,
            index: 0,
            attribute: 'speed',
            value: entity.speed.value
        });

        await deleteSubscription(subscription.id);
    });

    it('should send a notification. Simple subscription to idPattern 161', async function() {
        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    idPattern: '.*:V1234',
                    type: 'Vehicle'
                }
            ],
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        // Once subscription is created the first notification should be received
        await createSubscription(subscription);
		await http.post(entitiesResource, entity);
        await sleep(2000);
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification corresponding to the initial subscription
        assertNotification(accPayload, subscription.id, 1);

        // Only one notification as it should only be sent when the filter conditions are met
        assertNotificationContent(accPayload, subscription.id, {
            entityId,
            index: 0,
            attribute: 'speed',
            value: entity.speed.value
        });

        await deleteSubscription(subscription.id);
    });

    it('should send a notification. Subscription to one attribute with filter query 162', async function() {
        // Speed is updated so that the initial notification will not be received
        await http.post(entitiesResource, entity);
		await updateAttribute(entityId, 'speed', 10);

        // A Subscription is created
        const subscription = {
            id: 'urn:ngsi-ld:Subscription:mySubscription:' + new Date().getTime(),
            type: 'Subscription',
            entities: [
                {
                    type: 'Vehicle'
                }
            ],
            q: 'speed>80',
            notification: {
                endpoint: {
                    uri: notifyEndpoint,
                    accept: 'application/json'
                }
            }
        };

        // Here the initial notification should not be received as the query is not matched
        await createSubscription(subscription);
		
        
        const newSpeed = 90;
        await updateAttribute(entityId, 'speed', newSpeed);

        await sleep(2000);

        // Now checking the content of the accumulator
        const checkResponse = await http.get(accumulatorResource);
        const accPayload = checkResponse.response.body;

        // Only one notification corresponding to the initial subscription
        assertNotification(accPayload, subscription.id, 1);

        // Only one notification as it should only be sent when the filter conditions are met
        assertNotificationContent(accPayload, subscription.id, {
            entityId,
            index: 0,
            attribute: 'speed',
            value: newSpeed
        });

        await deleteSubscription(subscription.id);
    });
});
