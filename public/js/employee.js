'use strict' 
 
 // Get a list of items in employee based on the department_id 
 let departmentList = document.querySelector("#departmentList")
 departmentList.addEventListener("change", function () { 
  let department_id = departmentList.value 
  console.log(`department_id is: ${department_id}`) 
  let classIdURL = "/emp/getEmployee/" + department_id 
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
   buildEmployeeList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 })

// Build employee items into HTML table components and inject into DOM
function buildEmployeeList(data) { 
    let employeeDisplay = document.getElementById("employeeDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>';
    dataTable += '<tr><th>Picture</th><th>ID</th><th>First Name</th><th>Last Name</th><th>Birthday</th><th>Hire Day</th><th>Phone Number</th><th colspan="3">Actions</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all employees in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.emp_id + ", " + element.emp_fname + ", " + element.emp_mname + ", " + element.emp_lname); 
     
     let formattedBdate = moment(element.emp_bdate).format('MM-DD-YYYY');
     let formattedHdate = moment(element.emp_hdate).format('MM-DD-YYYY');

     dataTable += `<tr><td><img src="${element.emp_thumbnail}" alt="Employee Picture"></td>`;
     dataTable += `<td>${element.emp_id}</td>`; 
     dataTable += `<td>${element.emp_fname}</td>`;
     dataTable += `<td>${element.emp_lname}</td>`;
     dataTable += `<td>${formattedBdate}</td>`;
     dataTable += `<td>${formattedHdate}</td>`;
     dataTable += `<td>${element.emp_pnumber}</td>`;
     dataTable += `<td><a href='/emp/employee/${element.emp_id}' title='Click to view'>Details</a></td>`;    
     dataTable += `<td><a href='/emp/edit/${element.emp_id}' title='Click to update'>Edit</a></td>`; 
    }); 
    dataTable += '</tbody>'; 
    // Display the contents in the Employee Management view 
    employeeDisplay.innerHTML = dataTable; 
}