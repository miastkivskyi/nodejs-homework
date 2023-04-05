const contacts = require("../models/contacts");

const listContacts = async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const result = await contacts.getById(contactId);
    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await contacts.removeContact(id);
    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedContact = await contacts.updateContact(id, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
