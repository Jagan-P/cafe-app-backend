require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
const cafeRoutes = require("./routes/cafe");
const employeeRoutes = require("./routes/employee");
const cors = require("cors");
const { MongoMemoryServer } = require("mongodb-memory-server");

const startApp = async () => {
  const mongod = await MongoMemoryServer.create();
  console.log(mongod.getUri());

  app.use(express.json());
  app.use(cors());
  app.use(cafeRoutes);
  app.use(employeeRoutes);

  await mongoose.connect(mongod.getUri());

  app.listen(port, () => {
    console.log(`started app on ${port}`);
  });
};

startApp();
