const response = require('./res');
const connection = require('./conn');
const nodeMailer = require('nodemailer');
const md5 = require('md5');
const qrCode = require('qrcode');
const axios = require('axios');

exports.getName = (req, res) => {
    const { nim } = req.body;
    axios.post('http://passthrough.mtcbin.us:3001/extractBinusian', {
        nim: nim
    })
        .then(function(r) {
            response.ok(res, r.data.response);
        })
        .catch(function(error) {
            console.error(error);
            response.badrequest(res, error.message);
        })
};