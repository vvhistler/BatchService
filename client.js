const request = require('request');

const SERVICE_UNAVAILABLE = 503;
const TOO_MANY_REQUESTS = 429;
const RATE_LIMIT_INTERVAL = 10000;
const RATE_LIMIT_HEADER = 'x-ratelimit-remaining';
const MAX_RATE_LIMIT = 5;

let remainingRequests = MAX_RATE_LIMIT;
let lastRequestTime = Date.now() - RATE_LIMIT_INTERVAL;

const isLimitAchieved = () => {
    return remainingRequests<1 && Date.now() - lastRequestTime < RATE_LIMIT_INTERVAL;
};

const makeRequest = (options) => {
    return new Promise((resolve) => {

        const handler = (error, response, body) => {

            remainingRequests = parseInt(response.headers[RATE_LIMIT_HEADER]) || 0;
            lastRequestTime = Date.now();

            resolve(response);
        };

        if (isLimitAchieved()) {
            setTimeout(() => request(options, handler, RATE_LIMIT_INTERVAL));
        } else {
            request(options, handler);
        }
    });
};

const sendRequest = (uri, method, json) => {
    const options = {
        uri,
        method,
        body: JSON.stringify(json)
    }
    return makeRequest(options)
        .then(response => {
            if (response.statusCode === SERVICE_UNAVAILABLE) {
                //retry one more time
                return makeRequest(options);
            }
            return response;
        });
}

module.exports = { sendRequest };