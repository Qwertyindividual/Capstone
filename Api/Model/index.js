// Import DB Connection from Config Folder

db = require("../Config");

// Import bcrypt module

let { hash, compare, hashSync } = require("bcrypt");

// Token creation ---- "createToken"

let { createToken } = require("../Middleware/AuthenticatedUser.js");

// ---------- USER CLASS ---------- //

class User {
  // Login

  login(req, res) {
    const { emailAdd, userPass } = req.body;
    const strQry = `
        SELECT firstName, lastName, gender, cellPhoneNumber, emailAdd, userPass, userRole, userProfile, joinDate
        FROM Users
        WHERE emailAdd = '${emailAdd}';
        `;

    db.query(strQry, async (err, data) => {
      if (err) throw err;
      if (!data.length || data == null) {
        res.status(401).json({ err: "You provided an invalid email address." });
      } else {
        await compare(userPass, data[0].userPass, (cErr, cResult) => {
          if (cErr) throw cErr;

          // Token creation

          const jwToken = createToken({
            emailAdd,
            userPass,
          });

          // Saving

          res.cookie("LegitUser", jwToken, {
            maxAge: 3600000,
            httpOnly: true,
          });
          if (cResult) {
            res.status(200).json({
              msg: "User logged in successfully .",
              jwToken,
              result: data[0],
            });
          } else {
            res.status(401).json({
              err: "You entered an invalid password or did not register as a user.",
            });
          }
        });
      }
    });
  }

  // To fetch all users

  fetchUsers(req, res) {
    const strQry = `
    SELECT userID, firstName, lastName, gender, cellPhoneNumber, emailAdd, userPass, userRole, userProfile, joinDate
    FROM Users;
    `;

    db.query(strQry, (err, data) => {
      if (err) throw err;
      else res.status(200).json({ results: data });
    });
  }

  // To fetch a single user

  fetchUser(req, res) {
    const strQry = `
    SELECT userID, firstName, lastName, gender, cellPhoneNumber, emailAdd, userRole, userProfile, joinDate
    FROM Users
    WHERE userID = ?;
    `;

    db.query(strQry, [req.params.id], (err, data) => {
      if (err) throw err;
      else res.status(200).json({ result: data });
    });
  }

  // To create a user

  async createUser(req, res) {
    // Payload and hashing user password

    let detail = req.body;
    detail.userPass = await hash(detail.userPass, 15);

    // Authentication Information

    let user = {
      emailAdd: detail.emailAdd,
      userPass: detail.userPass,
    };

    const strQry = `
        INSERT INTO Users
        SET ?;
        `;

    db.query(strQry, [detail], (err) => {
      if (err) {
        res.status(401).json({ err });
      } else {
        // Token creation ---- to be saved in "cookie"
        // Duration is measured in milliseconds

        const jwToken = createToken(user);
        res.cookie("LegitUser", jwToken, {
          maxAge: 3600000,
          httpOnly: true,
        });
        res.status(200).json({ msg: "A user record has been saved." });
      }
    });
  }

  // To update a user record

  updateUser(req, res) {
    let data = req.body;
    if (data.userPass !== null || data.userPass !== undefined)
      data.userPass = hashSync(data.userPass, 15);
    const strQry = `
    UPDATE Users
    SET ?
    WHERE userID = ?;
    `;

    db.query(strQry, [data, req.params.id], (err) => {
      if (err) throw err;
      res.status(200).json({
        msg: "A row was affected.",
      });
    });
  }

  // To delete a user / user record

  deleteUser(req, res) {
    const strQry = `
    DELETE FROM Users
    WHERE userID = ?;
    `;

    db.query(strQry, [req.params.id], (err) => {
      if (err) throw err;
      res.status(200).json({
        msg: "A user record was deleted from a database.",
      });
    });
  }
}

// ---------- PRODUCT CLASS ---------- //

class Product {
  // To fetch all products
  fetchProducts(req, res) {
    const strQry = `
        SELECT prodID, productName, prodDescription, prodCategory, Price, Quantity, imgURL
        FROM Products;
        `;

    db.query(strQry, (err, results) => {
      if (err) throw err;
      res.status(200).json({ results: results });
    });
  }

  // To fetch a single product

  fetchProduct(req, res) {
    const strQry = `
    SELECT prodID, productName, prodDescription, prodCategory, Price, Quantity, imgURL
    FROM Products
    WHERE prodID = ?;
    `;

    db.query(strQry, [req.params.prodID], (err, results) => {
      if (err) throw err;
      res.status(200).json({ results: results });
    });
  }

  // To add a product record

  addProduct(req, res) {
    const strQry = `
    INSERT INTO Products
    SET ?
    `;

    db.query(strQry, [req.body], (err) => {
      if (err) {
        res.status(400).json({ err: "Unable to add a new product record." });
      } else {
        res.status(200).json({ msg: "Product record saved." });
      }
    });
  }

  // To update a product record

  updateProduct(req, res) {
    const strQry = `
    UPDATE Products
    SET ?
    WHERE prodID = ?;
    `;

    db.query(strQry, [req.body, req.params.prodID], (err) => {
      if (err) {
        res.status(400).json({ err: "Unable to update a product record ." });
      } else {
        res.status(200).json({ msg: "Product record updated and saved." });
      }
    });
  }

  // To delete a product record

  deleteProduct(req, res) {
    const strQry = `
    DELETE FROM Products
    WHERE prodID = ?;
    `;

    db.query(strQry, [req.params.prodID], (err) => {
      if (err)
        res.status(400).json({ err: "The product record was not found." });
      res.status(200).json({ msg: "A product record was deleted." });
    });
  }
}

/* Cart */

class Cart {
  fetchCart(req, res) {
    const strQry = `
        SELECT productName, prodDescription, imgURL
        FROM Users
        INNER JOIN Cart ON Users.userID = Cart.userID
        INNER JOIN Products ON Cart.prodID = Products.prodID
        WHERE Cart.userID = ${req.params.id};
        `;

    db.query(strQry, (err, results) => {
      if (err) throw err;
      res.status(200).json({ results: results });
    });
  }

  
  addCart(req, res) {
    const strQry = `
    INSERT INTO Cart
    SET ?
    `;

    db.query(strQry, [req.body], (err) => {
      if (err) {
        res.status(400).json({ err: "Unable to add a new cart record." });
      } else {
        res.status(200).json({ msg: "Cart record saved." });
      }
    });
  }


  updateCart(req, res) {
    const strQry = `
    UPDATE Cart
    SET ?
    WHERE cartID = ?;
    `;

    db.query(strQry, [req.body, req.params.id], (err) => {
      if (err) {
        res.status(400).json({ err: "Unable to update a cart record ." });
      } else {
        res.status(200).json({ msg: "Cart record updated and saved." });
      }
    });
  }


  deleteCart(req, res) {
    const strQry = `
    DELETE FROM Cart
    WHERE cartID = ?;
    `;

    db.query(strQry, [req.params.id], (err) => {
      if (err) res.status(400).json({ err: "The Cart record was not found." });
      res.status(200).json({ msg: "A Cart record was deleted." });
    });
  }
}

module.exports = {
  User,
  Product,
  Cart
};
