const pool = require("../database/")

/* ***************************
 *  Get all Departments data
 * ************************** */
async function getDepartments(){
  return await pool.query("SELECT * FROM public.department ORDER BY department_name")
}

  /* ***************************
 *  Get all employees and department_name by department_id
 * ************************** */
  async function getEmployeeByDepartmentId(department_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.employee AS e 
        JOIN public.department AS d 
        ON e.department_id = d.department_id
        WHERE e.department_id = $1`,
        [department_id]
      )
      return data.rows
    } catch (error) {
      console.error("getDepartmentId error " + error)
    }
  }

  /* ***************************
 *  Get all employees and department_name by employee_id
 * ************************** */
async function getEmployeeById(emp_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.employee AS e 
      JOIN public.department AS d 
      ON e.department_id = d.department_id 
      WHERE e.emp_id = $1`,
      [emp_id]
    )
    return data.rows
  } catch (error) {
    console.error("getEmployeeById error " + error)
  }
}

/* ***************************
 *  Add a new department
 * ************************** */
async function addDepartment(department_name){
  try {
    const sql = "INSERT INTO public.department (department_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [department_name]);
    return result.rows[0];
  } catch (error) {
    console.error("addDepartment error " + error)
    throw error;
  }
}


/* ***************************
 *  Add a new Employee
 * ************************** */
async function addEmployee(
    emp_fname,
    emp_mname,
    emp_lname,
    emp_bdate,
    emp_hdate,
    emp_image,
    emp_thumbnail,
    emp_pnumber,
    department_id,
  ) {
    const sql = `INSERT INTO public.employee 
      ( emp_fname,
        emp_mname,
        emp_lname,
        emp_bdate,
        emp_hdate,
        emp_image,
        emp_thumbnail,
        emp_pnumber,
        department_id)
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    try {
      return await pool.query(sql, [
        emp_fname,
        emp_mname,
        emp_lname,
        emp_bdate,
        emp_hdate,
        emp_image,
        emp_thumbnail,
        emp_pnumber,
        department_id,
      ]);
    } catch (error) {
      console.error("addEmployee error. " + error);
    }
}

/* ***************************
 *  Update Employee Data
 * ************************** */
async function updateEmployee(
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
  )
  {
    const sql =
    `UPDATE public.employee 
      SET
      emp_fname = $1,
      emp_mname = $2,
      emp_lname = $3,
      emp_bdate = $4,
      emp_hdate = $5,
      emp_image = $6,
      emp_thumbnail = $7,
      emp_pnumber = $8,
      department_id = $9       
      WHERE
        emp_id = $10
      RETURNING *`
  
      try {
        return (
          await pool.query(sql, [
            emp_fname,
            emp_mname,
            emp_lname,
            emp_bdate,
            emp_hdate,
            emp_image,
            emp_thumbnail,
            emp_pnumber,
            department_id,
            emp_id,
          ])
        ).rows[0];
      } catch (error) {
    console.error("editEmployee error. " + error);
  }
  }
  
    
    module.exports = { getDepartments, getEmployeeByDepartmentId, getEmployeeById, addDepartment,
      addEmployee, updateEmployee, };