const mongoose = require("mongoose");
const { Schema } = mongoose;

const cafeSchema = new Schema({
  name: {
    type: String,
    min: [6, "The name of cafe should be atleast 6 characters long"],
    max: [10, "The name of cafe should be maximum 10 characters long"],
    required: true,
  },
  description: {
    type: String,
    max: [256, "The cafe description cannot exceed 256 characters"],
    required: true,
  },
  logo: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  employees: {
    type: Number,
    default: 0
  },
});

const cafes = mongoose.model("cafes", cafeSchema);

module.exports = {
  cafes,
};
