const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "13.125.114.237",
    user: "user1",
    password: "1111",
    port: 52797,
    database: "ict",
});

module.exports = pool;
