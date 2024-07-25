const tempModel = require("../models/temple-model");
const utilities = require("../utilities");

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

tempCont.buildByTempleId = async function (req, res, next) {
  const temp_id = req.params.temp_id; 
  const data = await invModel.getTemplesByTempleId(temp_id);

  const grid = await utilities.buildTempleGrid(data)
  let nav = await utilities.getNav()

  const className = data[0]?.temple_name || "Unknown";

  res.render("./temples/temples", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });

};

/* ***************************
 *  Build inventory detail
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;// get inventory id from the request
  const data = await invModel.getInventoryById(inventory_id); // use inventory id to get the inventory based on id
  const detail = await utilities.buildByInventoryId(data); //build a view with the vehicles/inventory result
  
  let nav = await utilities.getNav(); // get our nav
  
  const title = data[0].inv_make + " " + data[0].inv_model || "Unknown"; // create the title of the page  
  
  // render the detail view  
  res.render("./inventory/detail", {
    title: title,
    nav,
    detail,
    errors: null,
  });

};

/* ***************************
*  Build management view
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();

  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/management", {
    title: "Inventory Management",
    errors: null,
    nav,
    classificationSelect,
  });
};

/* ***************************
 *  Form to add a vehicle
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();

  res.render("inventory/addVehicle", {
    title: "Add New Vehicle",
    errors: null,
    nav,
    classifications,
  });
};

/* ****************************************
*  Process form submission to add a vehicle 
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

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

  const response = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`
    );
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
    });
  } else {
    // This seems to never get called. Is this just for DB errors?
    req.flash("notice", "There was a problem.");
    res.render("inventory/addVehicle", {
      title: "Add New Vehicle",
      nav,
      errors: null,
    });
  }
};

/* ***************************
*  Render to add a classification
* ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
*  Process form submission to add a classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const nav = await utilities.getNav(); // After query, so it shows new classification

  const {
    classification_name
  } = req.body;

  const response = await invModel.addClassification(
    classification_name
  ); // ...to a function within the inventory model...
  

  if (response) {
    const itemName = response.classification_name;
    req.flash("notice", `The ${itemName} classification was successfully added.`);
    res.redirect("./management");

  } else {
    req.flash("notice", `Failed to add ${classification_name}`);
    res.render("inventory/addClassification", {
      title: "Add New Classification",
      errors: null,
      nav,
      classification_name,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build update vehicle view
 * ************************** */
invCont.editVehicleForm = async function (req, res, next) {
  //use inventory id to get inventory based on id
  const inventory_id = parseInt(req.params.inventoryId);// get inventory id from the request
  const nav = await utilities.getNav();
  const data = await invModel.getInventoryById(inventory_id); // use inventory id to get the inventory based on id
  const title = data[0].inv_make + " " + data[0].inv_model;   //create title of the page 
  let classificationList = await utilities.buildClassificationList(data.classification_id)   //build classification list

  res.render("./inventory/editVehicle", {
    title: "Edit " + title,
    nav,
    classificationList: classificationList,
    data,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_description: data[0].inv_description,
    inv_image: data[0].inv_image,
    inv_thumbnail: data[0].inv_thumbnail,
    inv_price: data[0].inv_price,
    inv_miles: data[0].inv_miles,
    inv_color: data[0].inv_color,  
    classification_id: data[0].classification_id
  })
}

/* ****************************************
 *  Process form submission to update vehicle
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

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

  const updateResult = await invModel.updateInventory(
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
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice",
       `The ${itemName} was successfully updated.`);
    res.redirect("./management");
  } else {
    const classifications = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("./inventory/editVehicle", {
      title: "Edit Vehicle " + itemName,
      nav,
      errors: null,
      classifications,
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
    });
  }
};

/* ***************************
 *  Delete confirmation view
 * ************************** */
invCont.deleteVehicleConfirmation = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;// get inventory id from the request
  const data = await invModel.getInventoryById(inventory_id); // use inventory id to get the inventory based on id
  let nav = await utilities.getNav(); // get our nav
  const title = data[0].inv_make + " " + data[0].inv_model || "Unknown"; // create the title of the page  
  
  // render the  view  
  res.render("./inventory/deleteConfirm", {
    title: "Delete " + title,
    nav,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_price: data[0].inv_price,
    errors: null,
  });
};

/* ****************************************
 *  Delete vehicle data
* *************************************** */
invCont.deleteVehicle = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;

  const deleteResult = await invModel.deleteVehicle(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  );
    
  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully deleted.`);
    res.redirect("./management");

  } else {
    req.flash("notice", `The vehicle was not deleted.`);
    res.status(501).render("inventory/deleteConfirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
}
}
  /* ***************************
 *  Build error route
 * ************************** */

  invCont.errorRoute = async function (req, res, next) {
    abcdefg
  };

module.exports = invCont;
