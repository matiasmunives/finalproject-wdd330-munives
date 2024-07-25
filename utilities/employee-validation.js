const utilities = require(".")
const { body, validationResult } = require("express-validator")
const moment = require('moment');
const validate = {}

// Add Employee Data Validation Rules
validate.employeeRules = () => {
    return [
      // valid department is required
      body("department_id")
        .isInt({ min: 1 })
        .withMessage("Select a valid department."),
      // valid fname is required
      body("emp_fname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Make must be at least 2 characters long."),
      body("emp_mname")
        .trim()
        .escape()
        .isLength({ min: 2 })
        .withMessage("Make must be at least 2 characters long."),
      body("emp_lname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters long."),
      // valid date is required
      body('emp_bdate')
        .trim()
        .notEmpty()
        .withMessage('Date of birth is required'),
        // valid date is required
        body('emp_hdate')
        .trim()
        .notEmpty()
        .withMessage('Date of hire is required'),
          body("emp_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Image path is required."),
          body("emp_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Image path is required."),
          // valid phone number is required and must be a positive number
          body('emp_pnumber')
          .trim()
          .escape()
          .isInt({ min: 10 })
          .withMessage("Phone Number is required."),
        ];
      };
  
  /* ******************************
   * Check data add employee and return errors or continue
   * ***************************** */
  validate.checkEmployeeData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const {
        emp_fname,
        emp_mname,
        emp_lname,
        emp_bdate,
        emp_hdate,
        emp_image,
        emp_thumbnail,
        emp_pnumber,
        department_id,
      } = req.body;
  
      let departments = await utilities.buildDepartmentList(
        department_id );
        
      let nav = await utilities.getNav();
      res.render("employee/addEmployee", { 
        errors,
        title: "Add New Vehicle",
        nav,
        departments,
        emp_fname,
        emp_mname,
        emp_lname,
        emp_bdate,
        emp_hdate,
        emp_image,
        emp_thumbnail,
        emp_pnumber,
      });
      return;
    }
    next();
  };

  /* ******************************
Add Department-Data-Validation Rules
 * ***************************** */

validate.departmentRules = () => {
    return [
      body("department_name")
        .trim()
        .notEmpty().withMessage('Department name is required') 
        .matches(/[a-zA-Z]/).withMessage('Department name must contain at least one letter') 
    ];
  };
  
  /* ******************************
   * Check data add department and return errors or continue
   * ***************************** */
  validate.checkDepartmentData = async (req, res, next) => {
    const { department_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("employee/addDepartment", { 
        errors,
        title: "Add New Department",
        nav,
        department_name,
      });
      return;
    }
    next();
  };

  /* ******************************
 * Check data to update vehicle and return errors or continue
 * ***************************** */
validate.checkUpdateEmployeeData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const {
        emp_id,
        emp_fname,
        emp_mname,
        emp_lname,
        emp_bdate,
        emp_hdate,
        emp_image,
        emp_thumbnail,
        emp_pnumber,
        department_id,
      } = req.body;
  
      let departmentList = await utilities.buildDepartmentList(
        department_id );
        
      let nav = await utilities.getNav();
      const title = emp_fname + " " + emp_lname
      res.render("employee/editEmployee", { 
        errors,
        title: "Edit Employee " + title,
        nav,
        departmentList,
        emp_id,
        emp_fname,
        emp_mname,
        emp_lname,
        emp_bdate,
        emp_hdate,
        emp_image,
        emp_thumbnail,
        emp_pnumber,
      });
      return;
    }
    next();
  };

  module.exports = validate;  