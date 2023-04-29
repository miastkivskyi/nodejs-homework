const express = require("express");
const ctrl = require("../controllers/users");
const { validateBody, authenticate, uploadDate } = require("../middlewares");
const { schemas } = require("../models/users");

const router = express.Router();

router.post("/register", validateBody(schemas.usersSchema), ctrl.register);

router.post("/login", validateBody(schemas.usersSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  validateBody(schemas.SubscriptionSchema),
  ctrl.updateSubscription
);

router.patch(
  "/avatars",
  authenticate,
  uploadDate.single("avatar"),
  ctrl.updateAvatar
);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
  "/verify",
  validateBody(schemas.emailSchema),
  ctrl.resendVerifyEmail
);

module.exports = router;
