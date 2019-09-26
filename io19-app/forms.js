const connection = require('./conn');
const random = require('./random');
const qrCode = require('qrcode');
const nodeMailer = require('nodemailer');
const credentials = require('./credentials');
const ical = require('ical-generator');

exports.reservationForm = (req, res) => {
    const requestBody = req.body;
    const { nim, name, email, dietary } = requestBody;
    const qrHash = random.generate(16);

    if (!req.recaptcha.error && req.recaptcha.data.score >= 0.7) {

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
                                    // generate ical
                                    const cal = ical({
                                        domain: 'mtcbin.us',
                                        prodId: {company: 'mtcbin.us', product: 'MAT I/O 2019'},
                                        name: 'MAT I/O 2019',
                                        timezone: 'Asia/Jakarta'
                                    });

                                    const event = cal.createEvent({
                                        start: new Date('Oct 04 2019 07:45:00 UTC'),
                                        end: new Date('Oct 04 2019 14:00:00 UTC'),
                                        timestamp: new Date(),
                                        summary: 'MAT I/O 2019 - MAT 23 Welcoming Party',
                                        organizer: 'BINUS Mobile Tech Community <contact@mtcbin.us>',
                                        geo: {
                                            lat: -6.1939096,
                                            lon: 106.7859456
                                        },
                                        location: "BINUS University Kijang Campus"                                    
                                    });

                                    // send email
                                    const emailGenerator = require('./generate-email-html');

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
                                        cc: credentials.getUsername(),
                                        subject: '[MAT I/O] Your E-Ticket',
                                        html: emailGenerator.generateHtml(name, dietary, "cid:reservation_qr", qrHash.match(/.{1,4}/g).join(' ')),
                                        text: emailGenerator.generateText(name, dietary, qrHash.match(/.{1,4}/g).join(' ')),
                                        attachments: [{
                                            filename: 'Your_QR.png',
                                            content: url.split("base64,")[1],
                                            encoding: 'base64',
                                            cid: 'reservation_qr'
                                        }],
                                        icalEvent: {
                                            filename: 'invitation.ics',
                                            method: 'request',
                                            content: cal.toString()
                                        }
                                    };

                                    transporter.sendMail(mailOptions, function (err, info) {
                                        if (err) {
                                            res.redirect("?error=Email not sent. Please try again");
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

    } else {
        console.log("captcha error: " + req.recaptcha.error);
        console.log("captcha score: " + req.recaptcha.data.score);
        res.redirect("?error=Captcha error. Please try again.");
    }
}