// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

//Route to account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement));

// Route to show Login form
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
    "/login-user",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)   
  );

// Route to show Registration form
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration));

// Route to process user registration
router.post("/register-user",
    regValidate.registrationRules(),
    regValidate.checkRegData,    
    utilities.handleErrors(accountController.registerAccount)
);

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Update account
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
router.post(
  "/update-account",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
  );

 //Update password 
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;