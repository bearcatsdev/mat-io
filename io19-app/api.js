const response = require('./res');
const nodeMailer = require('nodemailer');

exports.email = (req, res) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mai0email@jimeil.com',
            pass: 'haoxianghaoxiang'
        }
    });

    const mailOptions = {
        from: 'sambadi', // sender address
        to: 'maipren@jimeil.com', // list of receivers
        subject: 'Helo mai pren', // Subject line
        html: '<h1>Wats ap mai pren</h1><p>hau ar yu? ar yu okei? Mi feri okei</p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err) {
            response.badrequest(res, 'Oops. Something went wrong.');
            console.log(err);
        }
        else {
            response.ok(res, {'message': 'ok'});
            console.log(info);
        }
    });
};