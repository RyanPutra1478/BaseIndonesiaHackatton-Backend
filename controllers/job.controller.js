const { Job, User } = require("../models");
const { Op } = require("sequelize");

const jobController = {
    // CREATE Job (Draft or Open)
    async createJob(req, res, next) {
        try {
            const { title, description, wage, location, requirements } = req.body;
            const employerId = req.user.id; // From auth middleware

            const job = await Job.create({
                employerId,
                title,
                description,
                wage,
                location,
                requirements,
                status: "open", // Defaulting to open as per plan discussion, or we can make it draft if preferred. Let's stick to 'open' as default for MVP unless explicitly 'draft'.
            });

            return res.status(201).json({
                success: true,
                message: "Job created successfully",
                data: job,
            });
        } catch (error) {
            next(error);
        }
    },

    // UPDATE Job
    async updateJob(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const employerId = req.user.id;

            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            if (job.employerId !== employerId) {
                return res.status(403).json({ success: false, message: "Unauthorized: You do not own this job" });
            }

            if (job.status === 'in_contract' || job.status === 'completed') {
                return res.status(400).json({ success: false, message: "Cannot edit job in contract or completed state" });
            }

            await job.update(updates);

            return res.json({
                success: true,
                message: "Job updated successfully",
                data: job,
            });
        } catch (error) {
            next(error);
        }
    },

    // PUBLISH Job (Set status to open)
    async publishJob(req, res, next) {
        try {
            const { id } = req.params;
            const employerId = req.user.id;

            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            if (job.employerId !== employerId) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

            await job.update({ status: "open" });

            return res.json({
                success: true,
                message: "Job published successfully",
                data: job,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET Single Job
    async getJob(req, res, next) {
        try {
            const { id } = req.params;
            const job = await Job.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: "employer",
                        attributes: ["id", "name", "email", "kycStatus"], // Public info
                    },
                ],
            });

            if (!job) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            return res.json({
                success: true,
                data: job,
            });
        } catch (error) {
            next(error);
        }
    },

    // LIST Jobs (Public)
    async getJobs(req, res, next) {
        try {
            const { page = 1, limit = 10, search, location, minWage, maxWage } = req.query;
            const offset = (page - 1) * limit;

            const whereClause = {
                status: "open", // Only show open jobs publicly
            };

            if (search) {
                whereClause[Op.or] = [
                    { title: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                ];
            }

            if (location) {
                whereClause.location = { [Op.like]: `%${location}%` };
            }

            if (minWage) {
                whereClause.wage = { ...whereClause.wage, [Op.gte]: minWage };
            }
            if (maxWage) {
                whereClause.wage = { ...whereClause.wage, [Op.lte]: maxWage };
            }

            // If minWage and maxWage are both present, ensure we merge them correctly
            // The above approach might overwrite if both are set.
            // Better way:
            if (minWage || maxWage) {
                whereClause.wage = {};
                if (minWage) whereClause.wage[Op.gte] = minWage;
                if (maxWage) whereClause.wage[Op.lte] = maxWage;
            }


            const { count, rows } = await Job.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: "employer",
                        attributes: ["id", "name", "kycStatus"],
                    },
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]],
            });

            return res.json({
                success: true,
                data: rows,
                meta: {
                    total: count,
                    page: Number(page),
                    totalPages: Math.ceil(count / limit),
                },
            });
        } catch (error) {
            next(error);
        }
    },

    // CLOSE Job (Set status to closed)
    async closeJob(req, res, next) {
        try {
            const { id } = req.params;
            const employerId = req.user.id;

            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            if (job.employerId !== employerId) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

            await job.update({ status: "closed" });

            return res.json({
                success: true,
                message: "Job closed successfully",
                data: job,
            });
        } catch (error) {
            next(error);
        }
    },

    // CANCEL Job (Set status to cancelled)
    async cancelJob(req, res, next) {
        try {
            const { id } = req.params;
            const employerId = req.user.id;

            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            if (job.employerId !== employerId) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

            if (job.status === "in_contract" || job.status === "completed") {
                return res.status(400).json({
                    success: false,
                    message: "Cannot cancel job that is in contract or completed",
                });
            }

            await job.update({ status: "cancelled" });

            return res.json({
                success: true,
                message: "Job cancelled successfully",
                data: job,
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE Job
    async deleteJob(req, res, next) {
        try {
            const { id } = req.params;
            const employerId = req.user.id;

            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            if (job.employerId !== employerId) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

            if (["in_contract", "completed"].includes(job.status)) {
                return res.status(400).json({ success: false, message: "Cannot delete active/completed job" });
            }

            await job.destroy();

            return res.json({
                success: true,
                message: "Job deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = jobController;
