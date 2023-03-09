require("dotenv").config();
let { createPool } = require("mysql");
let connection = createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_User,
  password: process.env.DB_Pwd,
  port: process.env.DB_Port,
  multipleStatements: true,
});

module.exports = connection;
