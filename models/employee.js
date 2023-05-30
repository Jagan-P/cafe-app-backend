const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: {
    type: String,
    min: [6, "The name of employee should be atleast 6 characters long"],
    max: [10, "The name of employee should be maximum 10 characters long"],
    required: true,
  },
  email_address: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phone_number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[89][0-9]{7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone_number!`,
    },
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  cafe: {
    type: mongoose.Types.ObjectId,
    ref: "cafe",
  },
  start_date: {
    type: Date,
  },
});

const employees = mongoose.model("employees", employeeSchema);

module.exports = {
  employees,
};
