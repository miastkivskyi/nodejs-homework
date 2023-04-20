const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
const { Users } = require("../models/users");
const { ctrlWrapper, httpError } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await Users.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  user.token = token;
  await user.save();

  const userToSend = {
    email: user.email,
    subscription: user.subscription,
  };
  res.status(200).json({
    token,
    user: userToSend,
  });
};

const getCurrent = async (req, res) => {
  const { id } = req.user;
  const user = await Users.findById(id);
  if (!user) {
    throw httpError(401, "Not authorized");
  }
  const showedDataUser = { email: user.email, subscription: user.subscription };
  res.status(200).json(showedDataUser);
};

const logout = async (req, res) => {
  const { id } = req.user;
  const user = await Users.findById(id);
  if (!user) {
    return httpError(401, "Not authorized");
  }
  await Users.findByIdAndUpdate(id, { token: null });
  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { id } = req.user;
  const updatedUser = await Users.findByIdAndUpdate(id, req.body, {
    new: true,
    select: "email subscription",
  });
  if (!updatedUser) {
    throw httpError(404, "Not found");
  }
  res.status(200).json(updatedUser);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const image = await jimp.read(tempUpload);
  await image.cover(250, 250).write(resultUpload);

  await fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", filename);
  await Users.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
