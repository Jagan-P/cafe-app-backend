const express = require("express");
const {
  getCafes,
  addCafe,
  updateCafe,
  deleteCafe,
} = require("../controllers/cafe");
const router = express.Router();

router.get("/cafes", getCafes);
router.post("/cafe", addCafe);
router.put("/cafe/:cafeId", updateCafe);
router.delete("/cafe/:cafeId", deleteCafe);

module.exports = router;
