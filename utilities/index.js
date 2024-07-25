const invModel = require("../models/inventory-model")
const empModel = require("../models/employee-model")
const moment = require('moment');
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name + 
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" ></a>'
        grid += '<div class="namePrice">'
        grid += '<hr >'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the details view HTML
* ************************************ */
Util.buildByInventoryId = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-detail-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<img src="' + vehicle.inv_image
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" >'
      grid += '<hr >'
      grid += '<div class="detailInfo">'
      grid += '<p>' + '<strong>' + "Category: " + '</strong>' + vehicle.classification_name
      grid += '</p>'
      grid += '<p>' +  '<strong>' + "Price: " + '</strong>' + '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</p>'
      grid += '<p>' + '<strong>' + "Year " + '</strong>' + vehicle.inv_year
      grid += '</p>'
      grid += '<p>' + '<strong>' + "Miles: " + '</strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      grid += '</p>'
      grid += '<p class="description">' + '<strong>' + "Description: " + '</strong>' + vehicle.inv_description
      grid += '</p>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/***************************************
Build an HTML select element with classification data
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
* Function to update the browser cookie
**************************************** */

Util.updateCookie = (accountData, res) => {
const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
  expiresIn: 3600,
});
if (process.env.NODE_ENV === "development") {
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
} else {
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 3600 * 1000,
  });
}
};

/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
if (res.locals.loggedin) {
  next()
} else {
  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}
}

 /* ****************************************
 *  Check authorization
 * ************************************ */
Util.checkAuthorizationManager = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        if (
          accountData.account_type == "Employee" ||
          accountData.account_type == "Admin"
        ) {
          next();
        } else {
          req.flash("notice", "You are not authorized to modify inventory.");
          return res.redirect("/account/login");
        }
      }
    );
  } else {
    req.flash("notice", "You are not authorized to modify inventory.");
    return res.redirect("/account/login");
  }
};

/* **************************************
* Build the department view HTML
* ************************************ */
Util.buildDepartmentGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="emp-display">'
    data.forEach(employee => { 
      grid += '<li>'
      grid +=  '<a href="../../emp/employees/'+ employee.emp_id 
      + '" title="View ' + employee.inv_fname + ' '+ employee.emp_mname + ' '+ employee.emp_lname 
      + 'employees"><img src="' + employee.emp_thumbnail 
      +'" alt="Image of '+ employee.inv_fname + ' ' + employee.emp_lname  
      +'" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr >'
      grid += '<h2>'
      grid += '<a href="../../emp/employees/' + employee.emp_id +'" title="View ' 
      + employee.inv_fname + ' '+ employee.emp_mname + ' '+ employee.emp_lname  + ' employees">' 
      + employee.inv_fname + ' '+ employee.emp_mname + ' '+ employee.emp_lname  + '</a>'
      grid += '</h2>'
      grid += '<p>' + "Employee ID: " + employee.emp_id
      grid += '</p>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching employees could be found.</p>'
  }
  return grid
}

 /* **************************************
* Build the employees view HTML
* ************************************ */
Util.buildByEmployeeId = async function(data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="emp-detail-display">';
    data.forEach(employee => {

      let formattedBdate = moment(employee.emp_bdate).format('DD-MM-YYYY');
      let formattedHdate = moment(employee.emp_hdate).format('DD-MM-YYYY');
      
      grid += '<li>';
      grid += '<img src="' + employee.emp_image
        + '" alt="Image of ' + employee.emp_fname + ' ' + employee.emp_mname + ' ' + employee.emp_lname
        + '" >';
      grid += '<hr >';
      grid += '<div class="detailInfo">';
      grid += '<p>' + '<strong>' + "Employee ID: " + '</strong>' + employee.emp_id + '</strong>';
      grid += '<p>' + '<strong>' + "Department: " + '</strong>' + employee.department_name + '</p>';
      grid += '<p>' + '<strong>' + "Birthday: " + '</strong>' + formattedBdate + '</p>';
      grid += '<p>' + '<strong>' + "Hire Date: " + '</strong>' + formattedHdate + '</p>';
      grid += '<p>' + '<strong>' + "Phone Number: " + '</strong>' + employee.emp_pnumber + '</p>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching employees could be found.</p>';
  }
  return grid;
};

/***************************************
Build an HTML select element with department data
* ************************************ */
Util.buildDepartmentList = async function (department_id = null) {
  let data = await empModel.getDepartments();
  let departmentList =
    '<select name="department_id" id="departmentList" required>';
    departmentList += "<option value=''>Choose a Department</option>";
  data.rows.forEach((row) => {
    departmentList += '<option value="' + row.department_id + '"';
    if (
      department_id != null &&
      row.department_id == department_id
    ) {
      departmentList += " selected ";
    }
    departmentList += ">" + row.department_name + "</option>";
  });
  departmentList += "</select>";
  return departmentList;
};

module.exports = Util