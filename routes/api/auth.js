const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateAuth } = require("../../middlewares");
const { schemas } = require("../../models/users");

const router = express.Router();

router.post("/register", validateAuth(schemas.registerSchema), ctrl.register);

router.post("/login", validateAuth(schemas.loginSchema), ctrl.login);

module.exports = router;
