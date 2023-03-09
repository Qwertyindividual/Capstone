require("dotenv").config();
let { createPool } = require("mysql");
let connection = createPool({
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_NAME,
  USER: process.env.DB_User,
  PASSWORD: process.env.DB_Pwd,
  PORT: process.env.DB_Port,
  multipleStatements: true,
});

module.exports = connection;
