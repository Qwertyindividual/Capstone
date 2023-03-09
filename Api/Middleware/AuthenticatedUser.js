// ----------- AUTHENTICATION MIDDLEWARE ----------- //

//  Importing middleware

require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

// Token creation ---- "sign"

function createToken(user) {
  return sign(
    // Agree to terms and conditions
    {
      emailAdd: user.emailAdd,
      userPass: user.userPass,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
}

// Token verification ---- "verify"

function verifyToken(req, res, next) {
  try {
    const token =
      req.cookies["LegitUser"] !== null
        ? req.cookies["LegitUser"]
        : "Please register as a user.";
    const isValid = null;
    if (token !== "Please register as a user") {
      isValid = verify(token, process.env.SECRET_KEY);
      if (isValid) {
        req.authenticated = true;
        next();
      } else {
        res.status(400).json({ err: "Please register as a user." });
      }
    } else {
      res.status(400).json({ err: "Please register to be a user." });
    }
  } catch (e) {
    res.status(400).json({ err: e.message });
  }
}

module.exports = { createToken, verifyToken };
