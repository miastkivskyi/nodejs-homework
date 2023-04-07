const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const numberExample = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      match: numberExample,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

contactSchema.post("save", handleMongooseError);

const validateData = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const validateUpdate = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: Joi.string(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  validateData,
  validateUpdate,
  updateFavoriteSchema,
};

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};
