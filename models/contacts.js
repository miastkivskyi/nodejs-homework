const path = require("path");
const { v4 } = require("uuid");
const fs = require("fs/promises");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error(error.message);
  }
};

const getById = async (contactId) => {
  try {
    const data = await await listContacts();
    const contact = data.find((item) => String(item.id) === String(contactId));
    return contact;
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const newContacts = { id: v4(), ...body };
    contacts.push(newContacts);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
    return newContacts;
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const idx = contacts.findIndex((item) => item.id === contactId);
    if (idx === -1) {
      return null;
    }
    const newContacts = contacts.filter((_, index) => index !== idx);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 4));
    return contacts[idx];
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (id, body) => {
  try {
    const contacts = await listContacts();
    const idx = contacts.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) {
      return null;
    }

    const updatedContact = {
      ...contacts[idx],
      ...body,
      id: id,
    };

    contacts[idx] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));

    return updatedContact;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
