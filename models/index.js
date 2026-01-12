"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "config.js"))[
  env
];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelFiles = fs.readdirSync(__dirname).filter((file) => {
  const isJs = file.endsWith(".js");
  const isNotIndex = file !== basename;
  const isNotTest = !file.endsWith(".test.js");
  const isNotHidden = !file.startsWith(".");
  return isJs && isNotIndex && isNotTest && isNotHidden;
});

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);
  const defineModel = require(modelPath);

  if (typeof defineModel !== "function") {
    throw new Error(
      `[Sequelize] Model file "${file}" must export a function (sequelize, DataTypes) => Model`
    );
  }

  const model = defineModel(sequelize, Sequelize.DataTypes);

  if (!model || !model.name) {
    throw new Error(
      `[Sequelize] Model file "${file}" did not return a valid model with a name`
    );
  }

  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// (opsional) debug list model yang keload
console.log("[Sequelize] Loaded models:", Object.keys(db));

module.exports = db;
