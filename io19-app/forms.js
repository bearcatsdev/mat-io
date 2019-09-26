const connection = require('./conn');
const random = require('./random');

exports.reservationForm = (req, res) => {
    let userNim = req.body.user_nim;
    let userName = req.body.user_name;
    let userEmail = req.body.user_email;
    let userDietary = req.body.user_dietary;
    let qrHash = random.generate(16);

    // check if any field empty
    if (userNim == null || userName == null || userEmail == null || userDietary == null) {
        res.redirect("?error=Please fill all the fields");
        return;
    }

    // check if user already registered
    const sql = 'SELECT * FROM `participant_tb` WHERE `nim` = ?';
    connection.query(sql, [userNim], (e, r) => {
        if (e) {
            res.redirect("?error=Unknown error");
            console.log(e);

        } else {
            if (r.length > 0) {
                res.redirect("?error=User already registered");
                console.log("User already registered: " + userNim);

            } else if (r.length === 0) {
                // insert into database
                const sql1 = 'INSERT INTO `participant_tb` (`name`, `nim`, `email`, `dietary`, `checked_in`, `taken_food`, `qr_hash`) VALUES (?, ?, ?, ?, 0, 0, ?)';
                connection.query(sql1, [userName, userNim, userEmail, userDietary, qrHash], (e1, r1) => {
                    if (e1) {
                        res.redirect("?error=Unknown error");
                        console.log(e1);

                    } else {
                        // TODO SEND EMAIL

                        res.redirect("?success=1&qrhash=" + qrHash);
                    }
                });

            }
        }
    });
}