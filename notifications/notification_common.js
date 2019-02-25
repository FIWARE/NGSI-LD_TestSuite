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
  
  const response = await http.post(subscriptionsResource, subscription,{
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
  const overwrittenAttrs = {
  };
    
  overwrittenAttrs[propertyName] = {
    'type': 'Property',
    'value': newValue
  };
    
  const response = await http.post(entitiesResource + entityId
                                       + '/attrs/', overwrittenAttrs);
    
  expect(response.response).toHaveProperty('statusCode', 204);
}

module.exports = {
  createSubscription,
  deleteSubscription,
  updateAttribute
}
