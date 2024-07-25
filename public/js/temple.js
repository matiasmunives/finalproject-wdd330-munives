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

 // Build inventory items into HTML table components and inject into DOM 
function buildTempleList(data) { 
    let templeDisplay = document.getElementById("templeDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Temple Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) { 
     console.log(element.temp_id + ", " + element.temp_name); 
     dataTable += `<tr><td>${element.temp_picture} ${element.temp_name} ${element.temp_address} ${element.temp_city} ${element.temp_country} ${element.temp_phone} ${element.temp_address} ${element.temp_bdate} ${element.temp_ddate}</td>`; 
     dataTable += `<td><a href='/temp/view/${element.temp_id}' title='Click to delete'>View</a></td></tr>`; 
     dataTable += `<td><a href='/temp/edit/${element.temp_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/temp/delete/${element.temp_id}' title='Click to delete'>Delete</a></td></tr>`; 
     dataTable += `<td><a href='/temp/add/${element.temp_id}' title='Click to delete'>Add</a></td></tr>`; 
     dataTable += `<td><a href='/temp/view/${element.temp_id}' title='Click to delete'>View</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Temple Management view 
    templeDisplay.innerHTML = dataTable; 
   }