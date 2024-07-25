const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }

/* ****************************************
*  Deliver account management view
* *************************************** */
async function accountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Management",
    nav,
    errors: null,
  });
}

  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } =
  req.body

// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you are registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
    
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

   /* ****************************************
*  Deliver Logout view
* *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  delete res.locals.accountData;
  res.locals.loggedin = 0;
  req.flash("notice", "Logout successful.")
  res.redirect("/");
  return; 
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav();

  const accountDetails = await accountModel.getAccountById(req.params.accountId);
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = accountDetails;
  res.render("account/update", {
    title: "Account Update",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  });
}

/* ****************************************
 *  Process account update
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    } = req.body;

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (regResult) {
    req.flash("notice", `Congratulations, you've updated ${account_firstname}.`);
    const accountData = await accountModel.getAccountById(account_id); // Get it from data base to remake the cookie
    delete accountData.account_password;
    res.locals.accountData.account_firstname = accountData.account_firstname; // So it displays correctly
    utilities.updateCookie(accountData, res); // Remake the cookie with new data
    
    res.status(201).render("account/management", {
      title: "Account Update",
      errors: null,
      nav,
    });
    
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Account Update",
      errors: null,
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Process password update
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body;

  // Hash the password before storing.
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    );
    res.status(500).render("account/update", {
      title: "Password Update",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated the password.`
    );
    res.status(201).render("account/management", {
      title: "Password Update",
      errors: null,
      nav,
    });

  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Password Update",
      errors: null,
      nav,
    });
  }
}
  
module.exports = { buildLogin, buildRegistration, registerAccount,
accountLogin, accountManagement, accountLogout, buildUpdate, updateAccount, updatePassword }