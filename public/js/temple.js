'use strict' 
 
 // Get a list of items in temple based on the temple_id 
 let templeList = document.querySelector("#templeList")
 templeList.addEventListener("change", function () { 
  let temp_id = templeList.value 
  console.log(`temp_id is: ${temp_id}`) 
  let classIdURL = "/temp/getTemple/" + temp_id 
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
   buildTempleList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 })

   // Build temple items into HTML table components and inject into DOM
function buildTempleList(data) { 
    let templeDisplay = document.getElementById("templeDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>';
    dataTable += '<tr><th>ID</th><th>Temple</th><th>Address</th><th>City</th><th>Country</th><th>Phone Number</th><th>G-Date</th><th>D-Date</th><th colspan="3">Actions</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all temples in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.temp_id + ", " + element.temp_name); 
     
     let formattedBdate = moment(element.temp_bdate).format('MM-DD-YYYY');
     let formattedDdate = moment(element.temp_ddate).format('MM-DD-YYYY');
     
     dataTable += `<td>${element.temp_id}</td>`;
     dataTable += `<td>${element.temp_name}</td>`;
     dataTable += `<td>${element.temp_address}</td>`;
     dataTable += `<td>${element.temp_city}</td>`;
     dataTable += `<td>${element.temp_country}</td>`;
     dataTable += `<td>${element.temp_phone}</td>`;
     dataTable += `<td>${formattedBdate}</td>`;
     dataTable += `<td>${formattedDdate}</td>`;
     dataTable += `<td><a href='/temp/view/${element.temp_id}' title='Click to delete'>View</a></td>`; 
     dataTable += `<td><a href='/temp/edit/${element.temp_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/temp/delete/${element.temp_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }); 
    dataTable += '</tbody>'; 
    // Display the contents in the Temple Management view 
    templeDisplay.innerHTML = dataTable; 
}