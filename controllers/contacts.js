const { Contact } = require("../models/contacts");
const { ctrlWrapper, httpError } = require("../helpers");

const listContacts = async (req, res) => {
  const allContacts = await Contact.find({}, "-createdAt -updatedAt");
  res.status(200).json(allContacts);
};

const getById = async (req, res) => {
  const contactId = req.params.id;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw httpError(404, "Contact not found");
  }
  res.status(200).json(result);
};

const addContact = async (req, res) => {
  const { name } = req.body;
  const result = await Contact.findOne({ name });
  if (result) {
    throw httpError(409, "Contact already exists");
  }
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.status(200).json({ message: "Contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedContact) {
    throw httpError(404, "Not found");
  }

  res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  updateContact: ctrlWrapper(updateContact),
};
