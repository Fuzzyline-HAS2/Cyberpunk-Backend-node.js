var mysql = require('mysql');

var db_info = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Code3824@',
    database: 'has2cyberpunk',
    multipleStatements: true //다중쿼리용 설정 
}

module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}