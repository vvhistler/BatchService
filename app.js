const express = require('express');
const batchRouter = require('./batch');

const app = express();

app.use(express.json());

app.post('/batch', batchRouter);

app.listen(3000, function() {
    console.log('Server was srarted on port 3000!');
});
