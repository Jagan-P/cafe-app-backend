const { ObjectId } = require("mongodb");
const { errorHandler } = require("../helpers/errorHandlers");
const { cafes } = require("../models/cafe");
const { employees } = require("../models/employee");

const getEmployees = async (req, res) => {
  try {
    let matches = {};
    let aggregations = [];
    if (req.query.cafe) {
      matches.cafe = new ObjectId(req.query.cafe);
      aggregations.push({
        $match: matches,
      });
    }
    aggregations.push({
      $addFields: {
        days_worked: {
          $subtract: [
            {
              $dayOfMonth: new Date(),
            },
            {
              $dayOfMonth: "$start_date",
            },
          ],
        },
      },
    });
    aggregations.push({
      $sort: {
        days_worked: -1,
      },
    });
    aggregations.push(
      ...[
        {
          $lookup: {
            from: "cafes",
            localField: "cafe",
            foreignField: "_id",
            as: "cafe",
          },
        },
        // {
        //   $set: {
        //     cafe: "$cafe",
        //   },
        // },
        {
          $unwind: {
            path: "$cafe",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]
    );
    // const employeesInfo = await employees.find(matches).sort({ start_date: 1 });
    const employeesInfo = await employees.aggregate(aggregations);
    res.json({ employees: employeesInfo });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const addEmployee = async (req, res) => {
  try {
    const newEmployee = new employees(req.body);
    if (req.body.cafe) {
      newEmployee.start_date = new Date();
      await cafes.updateOne(
        {
          _id: req.body.cafe,
        },
        {
          $inc: {
            employees: 1,
          },
        }
      );
    }
    await newEmployee.save();
    res.json({ employee: newEmployee });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const updateEmployee = async (req, res) => {
  try {
    if (!req?.params?.employeeId) {
      throw {
        code: 400,
        result: "employeeId is required in path params",
      };
    }
    const existingEmployee = await employees.findOne({
      _id: req.params.employeeId,
    });
    if (
      existingEmployee?.cafe &&
      req?.body?.cafe &&
      existingEmployee?.cafe !== req?.body?.cafe
    ) {
      existingEmployee.start_date = new Date();
      let updates = [];
      updates.push({
        updateOne: {
          filter: {
            _id: existingEmployee.cafe,
          },
          update: {
            $inc: {
              employees: -1,
            },
          },
        },
      });
      updates.push({
        updateOne: {
          filter: {
            _id: req.body.cafe,
          },
          update: {
            $inc: {
              employees: 1,
            },
          },
        },
      });
      await cafes.bulkWrite(updates);
    } else if (!existingEmployee?.cafe && req?.body?.cafe) {
      existingEmployee.start_date = new Date();
      await cafes.updateOne(
        {
          _id: req.body.cafe,
        },
        {
          $inc: {
            employees: 1,
          },
        }
      );
    } else if (existingEmployee.cafe && !req.body.cafe) {
      existingEmployee.start_date = undefined;
      await cafes.updateOne(
        {
          _id: existingEmployee.cafe,
        },
        {
          $inc: {
            employees: -1,
          },
        }
      );
    }
    Object.assign(existingEmployee, req.body);
    await existingEmployee.save();
    res.json({ employee: existingEmployee });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    if (!req.params.employeeId) {
      throw {
        code: 400,
        result: "employeeId is required in path params",
      };
    }
    const existingEmployee = await employees.findOne({
      _id: req.params.employeeId,
    });
    if (existingEmployee.cafe) {
      await cafes.updateOne(
        {
          _id: existingEmployee.cafe,
        },
        {
          $inc: {
            employees: -1,
          },
        }
      );
    }
    await employees.deleteOne({
      _id: req.params.employeeId,
    });
    res.json({ result: "successfully deleted" });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
