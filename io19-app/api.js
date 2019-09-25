const response = require('./res');
const connection = require('./conn');
const nodeMailer = require('nodemailer');
const md5 = require('md5');

exports.email = (req, res) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mai0email@jimeil.com',
            pass: 'haoxianghaoxiang'
        }
    });

    const mailOptions = {
        from: 'sambadi',
        to: 'maipren@jimeil.com',
        subject: 'Helo mai pren',
        html: '<h1>Wats ap mai pren</h1><p>hau ar yu? ar yu okei? Mi feri okei</p>'
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

exports.newReservation = (req, res) => {
    const requestBody = req.body;
    const { name, nim, email, dietary } = requestBody;
    const qrHash = md5(name + nim);

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
                    response.ok(res, {'message': 'success'});
                }
            });
        } else {
            response.badrequest(res, 'Your nim has been reserved for MAT I/O 2019.');
        }
    });
};