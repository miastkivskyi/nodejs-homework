const isConflict = ({ name, code }) =>
  name === "MongoServerError" && code === 11000;

const handleMongooseError = (error, data, next) => {
  error.status = isConflict(error) ? 409 : 400;
  error.message =
    error.status === 409 ? "Contact already exists" : "Invalid data";
  next(error);
};

module.exports = handleMongooseError;
