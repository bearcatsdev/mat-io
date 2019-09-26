const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');
const port = process.env.PORT || 3696;
const random = require('./random')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, '0.0.0.0');
app.use(express.static('public'));

routes(app);