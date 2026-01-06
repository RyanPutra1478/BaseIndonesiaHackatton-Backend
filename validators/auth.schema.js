const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    role: z.enum(["worker", "employer"]).optional(), 
  }),
  params: z.any(),
  query: z.any(),
  headers: z.any(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  params: z.any(),
  query: z.any(),
  headers: z.any(),
});

module.exports = { registerSchema, loginSchema };
