/**
 *   HTTP functions for executing tests
 *
 *   Copyright (c) 2018. FIWARE Foundation e.V.
 *
 *
 */

const request = require('request');

function post(resource, data, headers) {
    headers = headers || {
        'Content-Type': 'application/json'
    };

    return new Promise(function(resolve, reject) {
        const options = {
            method: 'POST',
            uri: resource,
            body: data,
            headers,
            simple: false,
            json: true // Automatically stringifies the body to JSON
        };

        request(options, function(error, response, body) {
            return error
                ? reject(error)
                : resolve({
                      response,
                      body
                  });
        });
    });
}

function get(resource, headers) {
    return new Promise(function(resolve, reject) {
        const options = {
            method: 'GET',
            uri: resource,
            headers,
            json: true
        };

        request(options, function(error, response, body) {
            return error
                ? reject(error)
                : resolve({
                      response,
                      body
                  });
        });
    });
}

function del(resource, headers) {
    return new Promise(function(resolve, reject) {
        const options = {
            method: 'DELETE',
            uri: resource,
            headers,
            json: true
        };

        request(options, function(error, response, body) {
            return error
                ? reject(error)
                : resolve({
                      response,
                      body
                  });
        });
    });
}

function patch(resource, data, headers) {
    return new Promise(function(resolve, reject) {
        const options = {
            method: 'PATCH',
            uri: resource,
            body: data,
            headers,
            simple: false,
            json: true // Automatically stringifies the body to JSON
        };

        request(options, function(error, response, body) {
            return error
                ? reject(error)
                : resolve({
                      response,
                      body
                  });
        });
    });
}

module.exports = {
    post,
    get,
    delete: del,
    patch
};
