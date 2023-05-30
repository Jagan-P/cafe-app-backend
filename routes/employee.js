const express = require("express");
const {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee");
const router = express.Router();

router.get("/employees", getEmployees);
router.post("/employee", addEmployee);
router.put("/employee/:employeeId", updateEmployee);
router.delete("/employee/:employeeId", deleteEmployee);

module.exports = router;
