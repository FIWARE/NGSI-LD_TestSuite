/**
 *   Common functions for the notification tests
 *
 *   Copyright (c) 2019 FIWARE Foundation e.V.
 *
 */

const http = require('../http.js');
const testedResource = require('../common.js').testedResource;

const subscriptionsResource = testedResource + '/subscriptions/';

const entitiesResource = testedResource + '/entities/';

// Creates a new subscription
async function createSubscription(subscription, mimeType) {
    const mtype = mimeType || 'application/json';

    const response = await http.post(subscriptionsResource, subscription, {
        'Content-Type': mtype
    });

    expect(response.response).toHaveProperty('statusCode', 201);
}

// Deletes a subscription
async function deleteSubscription(subscriptionId) {
    const response = await http.delete(subscriptionsResource + subscriptionId);

    expect(response.response).toHaveProperty('statusCode', 204);
}

// Updates an attribute so that a new notification shall be triggered
async function updateAttribute(entityId, propertyName, newValue) {
    const overwrittenAttrs = {};

    overwrittenAttrs[propertyName] = {
        type: 'Property',
        value: newValue
    };

    const response = await http.post(entitiesResource + entityId + '/attrs/', overwrittenAttrs);

    expect(response.response).toHaveProperty('statusCode', 204);
}

// Checks whether under that subscriptionId
// such number of notifications have been delivered
function assertNotification(accumPayload, subscriptionId, numNotifications) {
    if (numNotifications === 0) {
        expect(accumPayload[subscriptionId]).toBeUndefined();
        return;
    }

    const notifData = accumPayload[subscriptionId];
    expect(notifData).toBeDefined();

    expect(notifData.notifications.length).toBe(numNotifications);
}

// Common logics for asserting existence of elements in notifications
function assertExistence(accumPayload, subscriptionId, entityInfo) {
    const notifications = accumPayload[subscriptionId];
    expect(notifications).toBeDefined();

    const entityData = notifications.entityData;
    expect(entityData).toBeDefined();

    const entityId = entityInfo.entityId;
    const index = entityInfo.index;

    expect(entityData[entityId]).toBeDefined();
    expect(entityData[entityId][index]).toBeDefined();
}

// Checks whether a certain subscriptionId entity content with a certain value
// has been received
function assertNotificationContent(accumPayload, subscriptionId, entityValue) {
    assertExistence(accumPayload, subscriptionId, entityValue);

    const entityData = accumPayload[subscriptionId].entityData;

    const entityId = entityValue.entityId;
    const index = entityValue.index;
    const attribute = entityValue.attribute;
    const value = entityValue.value;

    expect(entityData[entityId][index][attribute].value).toBe(value);
}

// Checks whether a certain subscriptionId entity content
// has NOT been received
function assertNotificationNoContent(accumPayload, subscriptionId, entityInfo) {
    assertExistence(accumPayload, subscriptionId, entityInfo);

    const entityId = entityInfo.entityId;
    const index = entityInfo.index;
    const attribute = entityInfo.attribute;

    const entityData = accumPayload[subscriptionId].entityData;

    expect(entityData[entityId][index][attribute]).toBeUndefined();
}

module.exports = {
    createSubscription,
    deleteSubscription,
    updateAttribute,
    assertNotification,
    assertNotificationContent,
    assertNotificationNoContent
};
