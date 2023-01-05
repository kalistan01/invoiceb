require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "b6h2bryqyyyrtope0h4g-mysql.services.clever-cloud.com",
    user: "utrgedxnpiudze0n",
    database: "b6h2bryqyyyrtope0h4g",
    password: "RyjuGUCuoGdi8hvsWKSq",
    Port: 3306
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD,
    // Port: process.env.DB_PORT
});
module.exports = pool.promise();
