const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const apiUrl = '/api/v1';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3696, '0.0.0.0');
app.use(express.static('public'));

routes(app, apiUrl);