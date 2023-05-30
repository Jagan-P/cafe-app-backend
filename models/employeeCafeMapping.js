const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeCafeMappingSchema = new Schema({
  employee: {
    type: mongoose.Types.ObjectId,
    ref: "employee",
  },
  cafe: {
    type: mongoose.Types.ObjectId,
    ref: "cafe",
  },
});

const employeeCafeMapping = mongoose.model(
  "employeeCafeMapping",
  employeeCafeMappingSchema
);

module.exports = {
  employeeCafeMapping,
};
