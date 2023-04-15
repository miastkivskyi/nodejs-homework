const express = require("express");
const ctrl = require("../../controllers/users");
const { validateAuth, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/users");

const router = express.Router();

router.post("/register", validateAuth(schemas.usersSchema), ctrl.register);

router.post("/login", validateAuth(schemas.usersSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  validateAuth(schemas.SubscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router;
