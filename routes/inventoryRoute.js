// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/vehicle-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to create intentional "error 500"
router.get("/error/", utilities.handleErrors(invController.errorRoute));

// Route to management page
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route to Add Vehicle Page
router.get("/add_vehicle", utilities.handleErrors(invController.buildAddInventory));

// Route to handle form submission for adding a vehicle
router.post("/add_vehicle",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory));
  
// Route to render the form to add a classification
router.get("/add_classification", utilities.handleErrors(invController.buildAddClassification));

// Route to handle form submission for adding a classification
router.post("/add_classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification));

//Router to get the vehicles for management view to update and delete
//Returns JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to update vehicle detail
router.get("/edit/:inventoryId", utilities.handleErrors(invController.editVehicleForm));

// Route to handle form for vehicle update
router.post(
  "/edit_vehicle",
  validate.inventoryRules(),
  validate.checkUpdateInventoryData,  
  utilities.handleErrors(invController.updateInventory));


// Route to delete vehicle
router.get("/delete/:inventoryId", utilities.handleErrors(invController.deleteVehicleConfirmation));

// Route to handle form for vehicle delete
router.post(
  "/delete_vehicle",
  utilities.handleErrors(invController.deleteVehicle));


module.exports = router;