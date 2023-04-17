const { Contact } = require("../models/contacts");
const { ctrlWrapper, httpError } = require("../helpers");

const listContacts = async (req, res) => {
  const { id } = req.user;
  const { page = 1, limit = 20, favorite = [true, false] } = req.query;
  const skip = (page - 1) * limit;

  const allContacts = await Contact.find(
    { owner: id, favorite },
    "-createdAt -updatedAt"
  )
    .populate("owner", "_id email")
    .skip(skip)
    .limit(parseInt(limit));
  res.status(200).json(allContacts);
};

const getById = async (req, res) => {
  const contactId = req.params.id;
  const result = await Contact.findById(contactId);
  if (!result) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.status(200).json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { name } = req.body;
  const result = await Contact.findOne({ name });
  if (result) {
    throw httpError(409, "Contact already exists");
  }
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "Contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    return res.status(404).json({ message: "Not found" });
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
