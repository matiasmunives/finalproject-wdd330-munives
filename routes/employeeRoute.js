// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const empController = require("../controllers/employeeController");
const utilities = require("../utilities");
const validate = require("../utilities/employee-validation");

// Route to build employee by department view
router.get("/type/:departmentId", utilities.handleErrors(empController.buildByDepartmentId));

// Route to build employee  view
router.get("/employee/:employeeId", utilities.handleErrors(empController.buildByEmployeeId));

// Route to management page
router.get("/management", utilities.handleErrors(empController.employeeManagement));

// Route to Add Vehicle Page
router.get("/add_employee", utilities.handleErrors(empController.buildAddEmployee));

// Route to handle form submission for adding a vehicle
router.post("/add_employee",
  validate.employeeRules(),
  validate.checkEmployeeData,
  utilities.handleErrors(empController.addEmployee));


// Route to render the form to add a department
router.get("/add_department", utilities.handleErrors(empController.buildAddDepartment));

// Route to handle form submission for adding a department
router.post("/add_department",
  validate.departmentRules(),
  validate.checkDepartmentData,
  utilities.handleErrors(empController.addDepartment));

//Router to get the employees for management view to update and delete
//Returns JSON
router.get("/getEmployee/:department_id", utilities.handleErrors(empController.getEmployeeJSON))

// Route to update employee detail
router.get("/edit/:employeeId", utilities.handleErrors(empController.editEmployeeForm));

// Route to handle form for employee update
router.post(
  "/edit_employee",
  validate.employeeRules(),
  validate.checkUpdateEmployeeData,  
  utilities.handleErrors(empController.updateEmployee));

module.exports = router;