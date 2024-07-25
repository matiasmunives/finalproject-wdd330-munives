// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const tempController = require("../controllers/tempController");
const utilities = require("../utilities");
const validate = require("../utilities/vehicle-validation");

// Route to build inventory by classification view
router.get("/type/:temp_id", utilities.handleErrors(tempController.buildByTempleId));

// Route to build inventory detail view
router.get("/detail/:temp_id", utilities.handleErrors(tempController.buildTempleDetailById));

// Route to create intentional "error 500"
router.get("/error/", utilities.handleErrors(tempController.errorRoute));

// Route to management page

router.get("/management", utilities.handleErrors(tempController.buildManagementView));

// Route to Add Vehicle Page
router.get("/add_vehicle", utilities.handleErrors(tempController.buildAddInventory));

// Route to handle form submission for adding a vehicle
router.post("/add_vehicle",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(tempController.addInventory));
  
// Route to render the form to add a classification
router.get("/add_classification", utilities.handleErrors(tempController.buildAddClassification));

// Route to handle form submission for adding a classification
router.post("/add_classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(tempController.addClassification));

//Router to get the vehicles for management view to update and delete
//Returns JSON
router.get("/getTemple/:temp_id", utilities.handleErrors(tempController.getTempleJSON))

// Route to update vehicle detail
router.get("/edit/:inventoryId", utilities.handleErrors(tempController.editVehicleForm));

// Route to handle form for vehicle update
router.post(
  "/edit_vehicle",
  validate.inventoryRules(),
  validate.checkUpdateInventoryData,  
  utilities.handleErrors(tempController.updateInventory));


// Route to delete vehicle
router.get("/delete/:inventoryId", utilities.handleErrors(tempController.deleteVehicleConfirmation));

// Route to handle form for vehicle delete
router.post(
  "/delete_vehicle",
  utilities.handleErrors(tempController.deleteVehicle));


module.exports = router;