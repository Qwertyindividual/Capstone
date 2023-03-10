// ---------- INDEX.JS ----------- //

const express = require("express");

// Route

const route = require("./Controllers");

// Cors

const cors = require("cors");

// Port

const port = parseInt(process.env.PORT) || 3000;

// Express App

const app = express();

// Middleware

const { errorHandling } = require("./Middleware/ErrorHandling");

// Cookie-Parser

const cookieParser = require("cookie-parser");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(route);

app.use(
  cors(),
  cookieParser(),
  express.json,
  express.urlencoded({ extended: false })
);

// Server is running...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Error Handling ---- All

app.use(errorHandling);