const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mat_io_19'
});

conn.connect((err) => {
    if (err) {
        console.log(err);
    }
});

module.exports = conn;