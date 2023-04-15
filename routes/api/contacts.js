const express = require("express");
const ctrl = require("../../controllers/contacts");

const router = express.Router();
const { schemas } = require("../../models/contacts");
const {
  validateBody,
  isValidId,
  validateFavorite,
  validateUpdate,
  authenticate,
} = require("../../middlewares");

router.get("/", authenticate, ctrl.listContacts);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.validateData),
  ctrl.addContact
);

router.delete("/:id", authenticate, isValidId, ctrl.removeContact);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateFavorite(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateUpdate(schemas.validateUpdate),
  ctrl.updateContact
);

module.exports = router;
