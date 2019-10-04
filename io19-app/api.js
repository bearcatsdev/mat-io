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

exports.checkIn = (req, res) => {
    const { qr_code : qrCode } = req.body;
    const sql = [
        "SELECT `name`, `nim`, `email`, `dietary`, `checked_in`, `taken_food`, `checked_in_time`, `taken_food_time`, `team` FROM `participant_tb` WHERE `qr_hash` = ?",
        "UPDATE `participant_tb` SET `checked_in` = 1, `checked_in_time` = CURRENT_TIMESTAMP WHERE `qr_hash` = ?"
    ];
    const decideTeam = (team) => {
        if (team === 0) {
            return "(Panitia)";
        } else if (team === 1) {
            return "(Team Ungu)";
        } else if (team === 2) {
            return "(Team Hijau Muda)";
        } else if (team === 3) {
            return "(Team Hijau Tua)";
        } else if (team === 4) {
            return "(Team Emas)";
        } else if (team === 5) {
            return "(Team Kuning)";
        } else if (team === 6) {
            return "(Team Oren)";
        } else if (team === 7) {
            return "(Team Merah)";
        } else if (team === 8) {
            return "(Team Pink)";
        } else if (team === 9) {
            return "(Team Hitam)";
        } else if (team === 10) {
            return "(Team Putih)";
        }
    };

    connection.query(sql[0], [qrCode], (e, r) => {
        if (e) {
            response.badrequest(res, 'An error occurred. (0)');
            console.log(e);
        } else if (r.length === 1) {
            const { checked_in: checkedIn } = r[0];

            if (checkedIn === 0) {
                connection.query(sql[1], [qrCode], (e1, r1) => {
                    if (e1) {
                        response.badrequest(res, 'An error occurred. (1)');
                        console.log(e1);
                    } else {
                        connection.query(sql[0], [qrCode], (e2, r2) => {
                            if (e2) {
                                response.badrequest(res, 'An error occurred. (2)');
                                console.log(e2);
                            } else {
                                const result = r2[0];
                                result.message = `Checked in ${decideTeam(result.team)}`;
                                delete result.team;
                                response.ok(res, result);
                            }
                        });
                    }
                });
            } else {
                const result = r[0];
                result.message = `Checked in ${decideTeam(result.team)}`;
                delete result.team;
                response.ok(res, result);
            }
        } else {
            response.unauthorized(res, "E-ticket is not valid");
        }
    })
};

exports.claimFood = (req, res) => {
    const { qr_code : qrCode } = req.body;

    const sql = [
        "SELECT `name`, `nim`, `email`, `dietary`, `checked_in`, `taken_food`, `checked_in_time`, `taken_food_time` FROM `participant_tb` WHERE `qr_hash` = ?",
        "UPDATE `participant_tb` SET `taken_food` = 1, `taken_food_time` = CURRENT_TIMESTAMP WHERE `qr_hash` = ?",
    ];

    connection.query(sql[0], [qrCode], (e, r) => {
        if (e) {
            response.badrequest(res, 'An error occurred. (0)');
            console.log(e);
        } else if (r.length === 1) {
            const { taken_food: takenFood } = r[0];

            if (takenFood === 0) {
                connection.query(sql[1], [qrCode], (e1, r1) => {
                    if (e1) {
                        response.badrequest(res, 'An error occurred. (1)');
                        console.log(e1);
                    } else {
                        connection.query(sql[0], [qrCode], (e2, r2) => {
                            if (e2) {
                                response.badrequest(res, 'An error occurred. (2)');
                                console.log(e2);
                            } else {
                                const result = r2[0];
                                result.message = "Enjoy your food";
                                response.ok(res, result);
                            }
                        });
                    }
                });
            } else {
                const result = r[0];
                result.message = `Food has been claimed once`;
                response.ok(res, result);
            }
        } else {
            response.unauthorized(res, "E-ticket is not valid");
        }
    })
};