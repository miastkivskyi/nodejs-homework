const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const validateFavorite = require("./validateFavorite");
const validateUpdate = require("./validateUpdate");
const validateAuth = require("./validateAuth");
const authenticate = require("./authenticate");

module.exports = {
  validateAuth,
  validateBody,
  isValidId,
  validateFavorite,
  validateUpdate,
  authenticate,
};
