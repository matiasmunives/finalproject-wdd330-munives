const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by inventory_id
 * ************************** */
async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error " + error)
    throw error;
  }
}


/* ***************************
 *  Add a new Vehicle
 * ************************** */
async function addInventory(
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
) {
  const sql = `INSERT INTO public.inventory 
    ( inv_make,
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id)
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )`;
  try {
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.error("addVehicle error. " + error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
)
{
  const sql =
  `UPDATE public.inventory 
    SET
    inv_make = $1,
      inv_model = $2, 
      inv_year = $3, 
      inv_description = $4, 
      inv_image = $5, 
      inv_thumbnail = $6, 
      inv_price = $7, 
      inv_miles = $8, 
      inv_color = $9, 
      classification_id = $10
    WHERE
      inv_id = $11
    RETURNING *`

    try {
      return (
        await pool.query(sql, [
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
          inv_id,
        ])
      ).rows[0];
    } catch (error) {
  console.error("editVehicle error. " + error);
}
}

/* ***************************
 *  Delete Vehicle
 * ************************** */
async function deleteVehicle(inv_id) {
  const sql =
    "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *";
  try {
    return await pool.query(sql, [inv_id,]);
  } catch (error) {
    console.error("deleteVehicle error. " + error);
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById,
  addClassification, addInventory, updateInventory, deleteVehicle};

