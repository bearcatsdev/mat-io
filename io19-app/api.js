const response = require('./res');
const connection = require('./conn');
const nodeMailer = require('nodemailer');
const md5 = require('md5');
const qrCode = require('qrcode');
const axios = require('axios');

exports.newReservation = (req, res) => {
    const requestBody = req.body;
    const { name, nim, email, dietary } = requestBody;
    const qrHash = md5(name + nim);

    axios.post('http://passthrough.mtcbin.us:3001/extractBinusian', {
        nim: nim
    })
        .then(function (responses) {
            if (responses.data.response.message) {
                response.badrequest(res, 'NIM is invalid');
            } else if (responses.data.response.name !== name.toUpperCase()) {
                response.badrequest(res, 'Name and NIM mismatches');
            } else {
                const sql = 'SELECT * FROM `participant_tb` WHERE `nim` = ?';
                connection.query(sql, [nim], (e, r) => {
                    if (e) {
                        response.badrequest(res, 'Error occurred. (0)');
                        console.log(e);
                    } else if (r.length === 0) {
                        const sql1 = 'INSERT INTO `participant_tb` (`name`, `nim`, `email`, `dietary`, `checked_in`, `taken_food`, `qr_hash`) VALUES (?, ?, ?, ?, 0, 0, ?)';
                        connection.query(sql1, [name, nim, email, dietary, qrHash], (e1, r1) => {
                            if (e1) {
                                response.badrequest(res, 'Error occurred. (1)');
                                console.log(e1);
                            } else {
                                qrCode.toDataURL(qrHash)
                                    .then(url => {
                                        const transporter = nodeMailer.createTransport({
                                            service: 'smtps://hello:huam@smtp.hutan.com/pool=true',
                                            auth: {
                                                user: 'bremmmmm@hutan.com@',
                                                pass: 'banjirsampetenggelam'
                                            }
                                        });

                                        const mailOptions = {
                                            from: 'Hello My Pren',
                                            to: email,
                                            subject: 'Your barcode',
                                            // TODO bikin format email
                                            html: '<h1>Hello World!<br /><img alt="qr code" src="cid:reservation_qr" />',
                                            attachments: [{
                                                filename: 'Your_QR.png',
                                                content: url.split("base64,")[1],
                                                encoding: 'base64',
                                                cid: 'reservation_qr'
                                            }]
                                        };

                                        transporter.sendMail(mailOptions, function (err, info) {
                                            if(err) {
                                                response.badrequest(res, 'Oops. Something went wrong.');
                                                console.log(err);
                                            }
                                            else {
                                                response.ok(res, {'message': 'Check your email for your reservation QR'});
                                                console.log(info);
                                            }
                                        });
                                    })
                                    .catch(err => {
                                        response.badrequest(res, 'Error occurred on rendering qr');
                                        console.log(err);
                                    });
                            }
                        });
                    } else {
                        response.badrequest(res, 'Your nim has been reserved for MAT I/O 2019.');
                    }
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};