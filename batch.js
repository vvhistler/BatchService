const client = require('./client');

const formatUri = (uriTemplate, queryParams) => {
    let uri = uriTemplate;
    Object.keys(queryParams).forEach((parameterName) => {
        uri = uriTemplate.replace(`{${parameterName}}`, queryParams[parameterName])
    });
    return uri
}

const generateResponse = (results) => {
    const items = [];
    let failed = 0;
    let succeed = 0;

    results.forEach(response => {
        items.push({
            uri: response.request.href,
            status: response.statusCode
        });
        (200 <= response.statusCode &&  response.statusCode < 300) ? succeed++ : failed++;
    });

    return {
        results: items,
        statistics: {
            totalCount: failed + succeed,
            failed,
            succeed
        }
    };
}

const batchHandler = (req, res) => {
    const {
        body: {
            uriTemplate,
            verb,
            payload
        }
    } = req;

    const requests = payload.map((params) => {

        const uri = formatUri(uriTemplate, params.queryParameters);

        return client.sendRequest(uri, verb, params.body);
    })

    Promise.all(requests).then(results => {
        const response = generateResponse(results)
        res.send(response);
    });
}
module.exports = batchHandler;