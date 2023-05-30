const { errorHandler } = require("../helpers/errorHandlers");
const { cafes } = require("../models/cafe");
const { employees } = require("../models/employee");
const { ObjectId } = require("mongodb");

const getCafes = async (req, res) => {
  try {
    let matches = {};
    if (req.query.location) {
      matches.location = req.query.location;
    }
    const cafesInfo = await cafes.find(matches).sort({ employees: -1 });
    res.json({ cafes: cafesInfo });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const addCafe = async (req, res) => {
  try {
    const newCafe = new cafes(req.body);
    await newCafe.save();
    res.json({ cafe: newCafe });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const updateCafe = async (req, res) => {
  try {
    if (!req.params.cafeId) {
      throw {
        code: 400,
        result: "cafeId is required in path params",
      };
    }
    const existingCafe = await cafes.findOne({ _id: req.params.cafeId });
    Object.assign(existingCafe, req.body);
    await existingCafe.save();
    res.json({ cafe: existingCafe });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const deleteCafe = async (req, res) => {
  try {
    if (!req.params.cafeId) {
      throw {
        code: 400,
        result: "cafeId is required in path params",
      };
    }
    const existingCafe = await cafes.findOne({ _id: req.params.cafeId });
    if (existingCafe.employees > 0) {
      await employees.deleteMany({ cafe: new ObjectId(req.params.cafeId) });
    }
    await cafes.deleteOne({ _id: req.params.cafeId });
    res.json({ result: "successfully deleted" });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

module.exports = {
  getCafes,
  addCafe,
  updateCafe,
  deleteCafe
};
