const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { v4 } = require("uuid");

const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");

const { Users } = require("../models/users");
const { ctrlWrapper, httpError, sendEmail } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = v4();

  const newUser = await Users.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Confirmation of registration on the website",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to confirm the email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await Users.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await Users.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to confirm the email</a>`,
  };

  await sendEmail(mail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  if (!user.verify) {
    res.status(401).json({ message: "Email not verified" });
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
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
