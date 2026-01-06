const { User } = require("../models");

async function findByEmail(email, options = {}) {
  return User.findOne({ where: { email }, ...options });
}

async function findById(id, options = {}) {
  return User.findByPk(id, options);
}

async function createUser(data, options = {}) {
  return User.create(data, options);
}

module.exports = { findByEmail, findById, createUser };
