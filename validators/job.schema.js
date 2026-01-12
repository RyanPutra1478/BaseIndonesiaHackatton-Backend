const { z } = require("zod");

const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    description: z.string().min(10),
    wage: z.string().or(z.number()).pipe(z.coerce.number().min(0)), // Accept string/number, coerce to number
    location: z.string().min(2).max(120),
    requirements: z.array(z.string()).optional().or(z.string().optional()), // Allow array of strings or simple string (generic JSON)
  }),
  params: z.any(),
  query: z.any(),
  headers: z.any(),
});

const patchJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().min(10).optional(),
    wage: z.string().or(z.number()).pipe(z.coerce.number().min(0)).optional(),
    location: z.string().min(2).max(120).optional(),
    requirements: z.any().optional(),
    status: z.enum(["draft", "open", "closed", "cancelled"]).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  query: z.any(),
  headers: z.any(),
});

const queryJobSchema = z.object({
  body: z.any(),
  params: z.any(),
  query: z.object({
    page: z.string().optional().transform(Number).or(z.number().optional()),
    limit: z.string().optional().transform(Number).or(z.number().optional()),
    search: z.string().optional(),
    location: z.string().optional(),
    minWage: z.string().optional().transform(Number).or(z.number().optional()),
    maxWage: z.string().optional().transform(Number).or(z.number().optional()),
  }),
  headers: z.any(),
});

module.exports = {
  createJobSchema,
  patchJobSchema,
  queryJobSchema
};
