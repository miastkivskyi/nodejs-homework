const express = require("express");
const contactsController = require("../../controllers/contacts");
const validate = require("../../validations/contacts");

const router = express.Router();

router.get("/", contactsController.listContacts);

router.get("/:id", contactsController.getById);

router.post("/", validate.validateData, contactsController.addContact);

router.delete("/:id", contactsController.removeContact);

router.put("/:id", validate.validateUpdate, contactsController.updateContact);

module.exports = router;
