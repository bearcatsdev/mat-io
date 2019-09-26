const connection = require('./conn');
const random = require('./random');

exports.reservationForm = (req, res) => {
    let userNim = req.body.user_nim;
    let userName = req.body.user_name;
    let userEmail = req.body.user_email;
    let userDietary = req.body.user_dietary;
    let qrHash = random.generate(16);

    // check if user already registered
    const sql = 'SELECT * FROM `participant_tb` WHERE `nim` = ?';
    connection.query(sql, [nim], (e, r) => {

    });
}