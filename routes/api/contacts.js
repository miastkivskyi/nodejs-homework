const express = require("express");
const ctrl = require("../../controllers/contacts");

const router = express.Router();
const { schemas } = require("../../models/contacts");
const {
  validateBody,
  isValidId,
  validateFavorite,
  validateUpdate,
} = require("../../middlewares");

router.get("/", ctrl.listContacts);

router.get("/:id", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.validateData), ctrl.addContact);

router.delete("/:id", isValidId, ctrl.removeContact);

router.patch(
  "/:id/favorite",
  isValidId,
  validateFavorite(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.put(
  "/:id",
  isValidId,
  validateUpdate(schemas.validateUpdate),
  ctrl.updateContact
);

module.exports = router;
