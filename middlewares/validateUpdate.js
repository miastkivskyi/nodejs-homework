const validateUpdate = (schema) => {
  const func = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  return func;
};

module.exports = validateUpdate;
