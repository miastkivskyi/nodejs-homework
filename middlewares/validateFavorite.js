const validateFavorite = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "missing field favorite",
      });
    }
    next();
  };
};

module.exports = validateFavorite;
