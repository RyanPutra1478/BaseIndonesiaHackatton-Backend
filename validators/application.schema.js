const { z } = require("zod");

const applyJobSchema = z.object({
    body: z.object({
        coverLetter: z.string().min(10).optional(),
    }),
    params: z.object({
        id: z.string().regex(/^\d+$/).transform(Number), // jobId
    }),
    query: z.any(),
    headers: z.any(),
});

module.exports = {
    applyJobSchema,
};
