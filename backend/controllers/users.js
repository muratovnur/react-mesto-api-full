const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OK } = require('../utils/constants');
const { BadRequestError } = require('../errors/bad-request-error');
const { NotFoundError } = require('../errors/not-found-error');
const { ConflictError } = require('../errors/conflict-error');

const { NODE_ENV = 'dev', JWT_SECRET } = process.env;

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }

      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный _id пользователя.'));
      }
      else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      else if (err.code === 11000) {
        next(new ConflictError('Почта с таким именем уже существует. Попробуйте сделать вход.'));
      }
      else {
        next(err);
      }
    });
};

const updateUserProfile = async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }

    res.status(OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  }).catch((err) => {
    if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    }
    else {
      next(err);
    }
  });
};

const updateUserAvatar = async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }

    res.status(OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  }).catch((err) => {
    if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные при обновлений аватара'));
    }
    else {
      next(err);
    }
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV !== 'production' ? 'dev-secret' : JWT_SECRET, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 43200000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

module.exports = {
  // getUsers,
  // getUserById,
  getUserInfo,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};

// const getUsers = (req, res, next) => {
//   User.find({})
//     .then((users) => {
//       const usersFormatted = users.map((user) => ({
//         name: user.name,
//         about: user.about,
//         avatar: user.avatar,
//         email: user.email,
//         _id: user._id,
//       }));
//       res.status(OK).send(usersFormatted);
//     })
//     .catch(next);
// };
//
// const getUserById = (req, res, next) => {
//   User.findById(req.params.userId)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Пользователь по указанному _id не найден.');
//       }

//       res.status(OK).send({
//         name: user.name,
//         about: user.about,
//         avatar: user.avatar,
//         email: user.email,
//         _id: user._id,
//       });
//     })
//     .catch((err) => {
//       // Если передан некорректный _id произойдет CastError перед пойском пользователя
//       if (err instanceof mongoose.Error.CastError) {
//         next(new BadRequestError('Передан некорректный _id пользователя.'));
//       }
//       else {
//         next(err);
//       }
//     });
// };
