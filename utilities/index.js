const tempModel = require("../models/temple-model")
const empModel = require("../models/employee-model")
const moment = require('moment');
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await tempModel.getTemples()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/temp/type/' +
      row.temp_id +
      '" title="See the ' +
      row.temp_name + 
      ' Temple">' +
      row.temp_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the temples view HTML
* ************************************ */
Util.buildTempleGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(temple => { 
        grid += '<li>'
        grid +=  '<a href="../../temp/detail/'+ temple.temp_id 
        + '" title="View ' + temple.temp_name +
        + 'details"><img src="' + temple.temp_picture
        +'" alt="Image of '+ temple.temp_name + 
        +' Temples" ></a>'
        grid += '<div class="namePrice">'
        grid += '<hr >'
        grid += '<h2>'
        grid += '<a href="../../temp/detail/' + temple.temp_id +'" title="View ' 
        + temple.temp_name + ' details">' 
        + temple.temp_name + '</a>'
        grid += '</h2>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching temples could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the details view HTML
* ************************************ */
Util.buildByTempleId = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-detail-display">'
    data.forEach(temple => { 
      grid += '<li>'
      grid +=  '<img src="' + temple.temp_picture
      +'" alt="Image of '+ temple.temp_name + 
      +' on Temples" >'
      grid += '<hr >'
      grid += '<div class="detailInfo">'
      grid += '<p>' + '<strong>' + "Address: " + '</strong>' + temple.temple_name
      grid += '</p>'
      grid += '<p>' +  '<strong>' + "City: " +  temple.temp_city
      grid += '</p>'
      grid += '<p>' + '<strong>' + "Country " + '</strong>' + temple.temp_country
      grid += '</p>'
      grid += '<p>' + '<strong>' + "Phone: " + '</strong>' + temple.temp_phone
      grid += '</p>'
      grid += '<p>' + '<strong>' + "Groundbreaking: " + '</strong>' + temple.temp_bdate
      grid += '</p>'
            grid += '<p>' + '<strong>' + "Dedication: " + '</strong>' + temple.temp_ddate
      grid += '</p>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching temples could be found.</p>'
  }
  return grid
}

/***************************************
Build an HTML select element with classification data
* ************************************ */
Util.buildTempleList = async function (temp_id = null) {
  let data = await tempModel.getTemples();
  let templeList =
    '<select name="temple_id" id="templeList" required>';
  templeList += "<option value=''>Choose a Temple</option>";
  data.rows.forEach((row) => {
    templeList += '<option value="' + row.temp_id + '"';
    if (
      temp_id != null &&
      row.temp_id == temp_id
    ) {
      templeList += " selected ";
    }
    templeList += ">" + row.temp_name + "</option>";
  });
  templeList += "</select>";
  return templeList;
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