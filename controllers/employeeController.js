const empModel = require("../models/employee-model");
const utilities = require("../utilities/");

const empCont = {}

/* **********************************
 *  Build Employee by Department View
 * ***********************************/

empCont.buildByDepartmentId = async function (req, res, next) {
    const department_id = req.params.departmentId; 
    const data = await empModel.getEmployeeByDepartmentId(department_id); 
  
    const grid = await utilities.buildDepartmentGrid(data) 
    let nav = await utilities.getNav() 
    const depName = data[0]?._name || "Unknown";
  
    res.render("./employee/department", {
      title: depName,
      nav,
      grid,
      errors: null,
    });
  
  };

  /* ***************************
 *  Build Employee detail
 * ************************** */
empCont.buildByEmployeeId = async function (req, res, next) {
  const employee_id = req.params.employeeId;
  const data = await empModel.getEmployeeById(employee_id); 
  const employees = await utilities.buildByEmployeeId(data); 

  let nav = await utilities.getNav(); 
  
  const title = data[0].emp_fname + " " + data[0].emp_mname + " " + data[0].emp_lname || "Unknown"; 
  
  // render the employees view  
  res.render("./employee/employees", {
    title: title,
    nav,
    employees,
    errors: null,
  });

};

/* ***************************
*  Build Management View
* ************************** */
empCont.employeeManagement = async function (req, res, next) {
  let nav = await utilities.getNav();

  const departmentSelect = await utilities.buildDepartmentList();

  res.render("employee/management", {
    title: "Employee Management",
    errors: null,
    nav,
    departmentSelect,
  });
};

/* ***************************
 *  Form to add a employee
 * ************************** */
empCont.buildAddEmployee = async function (req, res, next) {
  const nav = await utilities.getNav();
  let departments = await utilities.buildDepartmentList();

  res.render("employee/addEmployee", {
    title: "Add New Employee",
    errors: null,
    nav,
    departments,
  });
};

/* ****************************************
*  Process form submission to add a employee 
* *************************************** */
empCont.addEmployee = async function (req, res, next) {
  const nav = await utilities.getNav();

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

  const response = await empModel.addEmployee(
    emp_fname,
    emp_mname,
    emp_lname,
    emp_bdate,
    emp_hdate,
    emp_image,
    emp_thumbnail,
    emp_pnumber,
    department_id,
  );

  if (response) {
    req.flash(
      "notice",
      `The ${emp_fname} ${emp_mname} ${emp_lname} was successfully added.`
    );
    const departmentSelect = await utilities.buildDepartmentList(department_id);
    res.render("employee/management", {
      title: "Employee Management",
      nav,
      departmentSelect,
      errors: null,
    });
  } else {
    // This seems to never get called. Is this just for DB errors?
    req.flash("notice", "There was a problem.");
    res.render("employee/addEmployee", {
      title: "Add New Employee",
      nav,
      errors: null,
    });
  }
};

/* ***************************
*  Render to add a department
* ************************** */
empCont.buildAddDepartment = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("employee/addDepartment", {
    title: "Add New Department",
    nav,
    errors: null,
  });
};

/* ****************************************
*  Process form submission to add a department
* *************************************** */
empCont.addDepartment = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    department_name
  } = req.body;

  const response = await empModel.addDepartment(
    department_name
  );  

  if (response) {
    const itemName = response.department_name;
    req.flash("notice", `The ${itemName} department was successfully added.`);
    res.redirect("./management");

  } else {
    req.flash("notice", `Failed to add ${department_name}`);
    res.render("employee/addDepartment", {
      title: "Add New Department",
      errors: null,
      nav,
      department_name,
    });
  }
};

/* ***************************
 *  Return Employees by Department As JSON
 * ************************** */
empCont.getEmployeeJSON = async (req, res, next) => {
  const department_id = parseInt(req.params.department_id)
  const empData = await empModel.getEmployeeByDepartmentId(department_id)
  if (empData[0].emp_id) {
    return res.json(empData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build update employee view
 * ************************** */
empCont.editEmployeeForm = async function (req, res, next) {
  const employee_id = parseInt(req.params.employeeId);
  const nav = await utilities.getNav();
  const data = await empModel.getEmployeeById(employee_id); 
  const title = data[0].emp_fname + " " + data[0].emp_mname + " " + data[0].emp_lname;
  let departmentList = await utilities.buildDepartmentList(data.department_id)
  res.render("./employee/editEmployee", {
    title: "Edit " + title,
    nav,
    departmentList: departmentList,
    data,
    errors: null,
    emp_id: data[0].emp_id,
    emp_fname: data[0].emp_fname,
    emp_mname: data[0].emp_mname,
    emp_lname: data[0].emp_lname,
    emp_bdate: data[0].emp_bdate,
    emp_hdate: data[0].emp_hdate,
    emp_image: data[0].emp_image,
    emp_thumbnail: data[0].emp_thumbnail,
    emp_pnumber: data[0].emp_pnumber,
    department_id: data[0].department_id,
  })
}

/* ****************************************
 *  Process form submission to update employee
* *************************************** */
empCont.updateEmployee = async function (req, res, next) {
  const nav = await utilities.getNav();

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

  const updateResult = await empModel.updateEmployee(
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
  );

  if (updateResult) {
    const itemName = updateResult.emp_fname + " " + updateResult.emp_mname + " " + updateResult.emp_lname;
    req.flash("notice",
       `The ${itemName} was successfully updated.`);
    res.redirect("./management");
  } else {
    const departments = await utilities.buildDepartmentList(department_id);
    const itemName = `${emp_fname} ${emp_mname} ${emp_lname}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("./employee/editEmployee", {
      title: "Edit Employee " + itemName,
      nav,
      errors: null,
      departments,
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
    });
  }
};


module.exports = empCont;