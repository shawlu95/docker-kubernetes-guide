const path = require('path');
const fs = require('fs');

const axios = require('axios');
const { createAndThrowError, createError } = require('../helpers/error');

const User = require('../models/user');

const validateCredentials = (email, password) => {
  if (
    !email ||
    email.trim().length === 0 ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    createAndThrowError('Invalid email or password.', 422);
  }
};

const checkUserExistence = async (email) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    createAndThrowError('Failed to create user.', 500);
  }

  if (existingUser) {
    createAndThrowError('Failed to create user.', 422);
  }
};

const getHashedPassword = async (password) => {
  try {
    const response = await axios.get(
      `http://${process.env.AUTH_API_ADDRESS}/hashed-pw/${password}`
    );
    return response.data.hashed;
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || 'Failed to create user.', code);
  }
};

const getTokenForUser = async (password, hashedPassword, uid) => {
  try {
    const response = await axios.post(
      `http://${process.env.AUTH_API_ADDRESS}/token`,
      {
        password: password,
        hashedPassword: hashedPassword,
        userId: uid
      }
    );
    return response.data.token;
  } catch (err) {
    const code = (err.response && err.response.status) || 500;
    createAndThrowError(err.message || 'Failed to verify user.', code);
  }
};

const createUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    validateCredentials(email, password);
  } catch (err) {
    return next(err);
  }

  try {
    await checkUserExistence(email);
  } catch (err) {
    return next(err);
  }

  let hashedPassword;
  try {
    hashedPassword = await getHashedPassword(password);
  } catch (err) {
    return next(err);
  }

  console.log(hashedPassword);

  const newUser = new User({
    email: email,
    password: hashedPassword,
  });

  let savedUser;
  try {
    savedUser = await newUser.save();
  } catch (err) {
    const error = createError(err.message || 'Failed to create user.', 500);
    return next(error);
  }

  const logEntry = `${new Date().toISOString()} - ${savedUser.id} - ${email}\n`;

  fs.appendFile(
    path.join('/app', 'users', 'users-log.txt'),
    logEntry,
    (err) => {
      console.log(err);
    }
  );

  res
    .status(201)
    .json({ message: 'User created.', user: savedUser.toObject() });
};

const verifyUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    validateCredentials(email, password);
  } catch (err) {
    return next(err);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = createError(
      err.message || 'Failed to find and verify user.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = createError(
      'Failed to find and verify user for provided credentials.',
      422
    );
    return next(error);
  }

  try {
    console.log(password, existingUser);
    const token = await getTokenForUser(
      password,
      existingUser.password,
      existingUser.id
    );
    res.status(200).json({ token: token, userId: existingUser.id });
  } catch (err) {
    next(err);
  }
};

const getLogs = (req, res, next) => {
  fs.readFile(path.join('/app', 'users', 'users-log.txt'), (err, data) => {
    if (err) {
      createAndThrowError('Could not open logs file.', 500);
    } else {
      const dataArr = data.toString().split('\n');
      res.status(200).json({ logs: dataArr });
    }
  });
};

exports.createUser = createUser;
exports.verifyUser = verifyUser;
exports.getLogs = getLogs;
