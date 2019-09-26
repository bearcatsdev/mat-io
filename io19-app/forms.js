const connection = require('./conn');
const random = require('./random');
const qrCode = require('qrcode');
const nodeMailer = require('nodemailer');
const credentials = require('./credentials');

exports.reservationForm = (req, res) => {
    const requestBody = req.body;
    const { nim, name, email, dietary } = requestBody;
    const qrHash = random.generate(16);

    // check if any field empty
    if (nim == null || name == null || email == null || dietary == null) {
        res.redirect("?error=Please fill all the fields");
        return;
    }

    // check if user already registered
    const sql = 'SELECT * FROM `participant_tb` WHERE `nim` = ?';
    connection.query(sql, [nim], (e, r) => {
        if (e) {
            res.redirect("?error=Unknown error");
            console.log(e);

        } else {
            if (r.length > 0) {
                res.redirect("?error=User already registered");
                console.log("User already registered: " + nim);

            } else if (r.length === 0) {
                // insert into database
                const sql1 = 'INSERT INTO `participant_tb` (`name`, `nim`, `email`, `dietary`, `checked_in`, `taken_food`, `qr_hash`) VALUES (?, ?, ?, ?, 0, 0, ?)';
                connection.query(sql1, [name, nim, email, dietary, qrHash], (e1, r1) => {
                    if (e1) {
                        res.redirect("?error=Unknown error");
                        console.log(e1);

                    } else {
                        qrCode.toDataURL(qrHash)
                            .then(url => {
                                var sendOptions = {
                                    host: credentials.getSmtpServer(),
                                    port: 465,
                                    secure: true, // use SSL
                                    auth: {
                                        user: credentials.getUsername(),
                                        pass: credentials.getPassword()
                                    }
                                }    

                                const transporter = nodeMailer.createTransport(sendOptions);

                                const mailOptions = {
                                    from: "MTC Binus <" + credentials.getUsername() + ">",
                                    to: email,
                                    bcc: credentials.getUsername(),
                                    subject: '[MAT I/O] Your E-Ticket',
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
                                        res.redirect("?error=Email not sent");
                                        console.log(err);
                                    }
                                    else {
                                        res.redirect("?success=1&qrhash=" + qrHash);
                                        console.log(info);
                                    }
                                });
                            })
                            .catch(err => {
                                res.redirect("?error=QR generate failed");
                                console.log(err);
                            });
                    }
                });

            }
        }
    });
}