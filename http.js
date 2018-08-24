/**
 *   HTTP functions for executing tests
 *
 *   Copyright (c) 2018. FIWARE Foundation e.V.
 *
 *
 */

'use strict';

var request = require('request');

function post(resource, data, headers) {
    return new Promise(function(resolve, reject) {
        let options = {
            method: 'POST',
            uri: resource,
            body: data,
            headers: headers,
            simple: false,
            json: true // Automatically stringifies the body to JSON
        };

        request(options, function(error, response, body) {
           error ? reject(error) : resolve({
                response: response,
                body: body
            });
        });
    });
}

function get(resource, headers) {
    return new Promise(function(resolve, reject) {
        let options = {
            method: 'GET',
            uri: resource,
            headers: headers,
            json: true
        };

        request(options, function(error, response, body) {
            error ? reject(error) : resolve({
                response: response,
                body: body
            });
        });
    });
}

function del(resource, headers) {
    return new Promise(function(resolve, reject) {
        let options = {
            method: 'DELETE',
            uri: resource,
            headers: headers,
            json: true
        };

        request(options, function(error, response, body) {
            error ? reject(error) : resolve({
                response: response,
                body: body
            });
        });
    });
}

function patch(resource, data, headers) {
    return new Promise(function(resolve, reject) {
         let options = {
            method: 'PATCH',
            uri: resource,
            body: data,
            headers: headers,
            simple: false,
            json: true // Automatically stringifies the body to JSON
        };

        request(options, function(error, response, body) {
            error ? reject(error) : resolve({
                response: response,
                body: body
            });
        });
    });
}

module.exports = {
    'post': post,
    'get': get,
    'delete': del,
    'patch': patch
};
