const testedResource = require('../common.js').testedResource;
const http = require('../http.js');

const subscriptionsResource = testedResource + '/subscriptions/';

// Patches the object and returns a new copy of the patched object
// TECHNICAL DEBT: It should be imported from common.js
function patchObj(target, patch) {
    const copy = JSON.parse(JSON.stringify(target));
    return Object.assign(copy, patch);
}

describe('Create Subscription. Errors. JSON', () => {
    // Base subscription (mutable to make errors happen)
    const subscription = {
        id: 'urn:ngsi-ld:Subscription:9000',
        type: 'Subscription',
        entities: [
            {
                id: 'urn:ngsi-ld:T:T1234',
                type: 'T'
            }
        ],
        watchedAttributes: ['a1'],
        notification: {
            endpoint: {
                uri: 'http://localhost:1080'
            }
        }
    };

    it('should reject a subscription which id is not a URI', async function() {
        const testSubscription = patchObj(subscription, { id: '1234' });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which type is not Subscription', async function() {
        const testSubscription = patchObj(subscription, { type: 'T' });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which does not include "entities" nor "watachedAttributes"', async function() {
        const testSubscription = {
            id: 'urn:ngsi-ld:Subscription:9000',
            type: 'Subscription',
            notification: {
                endpoint: {
                    uri: 'http://localhost:1080'
                }
            }
        };

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which watched attributes is null', async function() {
        const testSubscription = patchObj(subscription, {
            watchedAttributes: null
        });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which watched attributes array is 0 length', async function() {
        const testSubscription = patchObj(subscription, { watchedAttributes: [] });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which entities array is 0 length', async function() {
        const testSubscription = patchObj(subscription, { entities: [] });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which entities array does not contain a type', async function() {
        const testSubscription = {
            id: 'urn:ngsi-ld:Subscription:9000',
            type: 'Subscription',
            entities: [
                {
                    id: 'urn:ngsi-ld:T:T1234'
                }
            ]
        };

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which does not define notification parameters', async function() {
        const testSubscription = {
            id: 'urn:ngsi-ld:Subscription:9000',
            type: 'Subscription',
            entities: [
                {
                    id: 'urn:ngsi-ld:T:T1234',
                    type: 'T'
                }
            ]
        };

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which "isActive" field is not a boolean', async function() {
        const testSubscription = patchObj(subscription, { isActive: 'abcde' });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    it('should reject a subscription which "endpoint" is not a URI', async function() {
        const notification = patchObj(subscription.notification, {
            endpoint: { uri: 'abcde' }
        });
        const testSubscription = patchObj(subscription, { notification });

        const response = await http.post(subscriptionsResource, testSubscription);
        expect(response.response).toHaveProperty('statusCode', 400);
    });

    // TODO: Add here more tests (null values, etc.)
});
