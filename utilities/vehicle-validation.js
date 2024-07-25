const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const validate = {};

// Add Vehicle Data Validation Rules
validate.inventoryRules = () => {
  return [
    // valid classification is required
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Select a valid classification."),
    // valid make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),
    // valid model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),
    // valid year is required
    body("inv_year")
      .isInt({ min: 1800, max: new Date().getFullYear() + 1 })
      .withMessage("Please enter a valid year."),
    // valid description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long."),
    // a image is required
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Image path is required."),
    // valid price is required and must be a positive number
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    // valid miles is required and must be a positive number
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),
    // valid color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
  ];
};

/* ******************************
 * Check data add vehicle and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    let classifications = await utilities.buildClassificationList(
      classification_id );
      
    let nav = await utilities.getNav();
    res.render("inventory/addVehicle", { 
      errors,
      title: "Add New Vehicle",
      nav,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/* ******************************
Add Classification-Data-Validation Rules
 * ***************************** */

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage('Classification name is required') 
      .matches(/^[^\s]*$/).withMessage('Classification name must not contain spaces') // Disallow spaces
      .matches(/[a-zA-Z]/).withMessage('Classification name must contain at least one letter') // Ensure it has at least one letter
  ];
};

/* ******************************
 * Check data add classification and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", { 
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data to update vehicle and return errors or continue
 * ***************************** */
validate.checkUpdateInventoryData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const {
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      } = req.body;
  
      let classificationList = await utilities.buildClassificationList(
        classification_id );
        
      let nav = await utilities.getNav();
      const title = inv_make + " " + inv_model
      res.render("inventory/editVehicle", { 
        errors,
        title: "Edit Vehicle" + title,
        nav,
        classificationList,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      });
      return;
    }
    next();
  };

  
  module.exports = validate;  