const { Job } = require("../models");

async function findById(id, options = {}) {
    return Job.findByPk(id, options);
}

async function updateStatus(id, status, options = {}) {
    return Job.update({ status }, { where: { id }, ...options });
}

module.exports = {
    findById,
    updateStatus,
};
