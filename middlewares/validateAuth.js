const validateAuth = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Error from Joi or other validation library",
      });
    }
    next();
  };

  return func;
};

module.exports = validateAuth;
