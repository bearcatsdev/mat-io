let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3696, '0.0.0.0');
app.use(express.static('public'));

routes(app);