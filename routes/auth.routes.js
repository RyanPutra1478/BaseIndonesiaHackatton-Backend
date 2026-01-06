const router = require("express").Router();
const validate = require("../middlewares/validate");
const authJwt = require("../middlewares/authJwt");
const authController = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../validators/auth.schema");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authJwt, authController.me);

module.exports = router;
