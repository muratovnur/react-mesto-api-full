const usersRouter = require('express').Router();
const {
  validateUpdateUserProfile, validateUpdateUserAvatar, /* validateGetUserById, */
} = require('../middlewares/validations');
const {
  getUserInfo, updateUserProfile, updateUserAvatar, /* getUserById, getUsers, */
} = require('../controllers/users');

usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', validateUpdateUserProfile, updateUserProfile);
usersRouter.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

// usersRouter.get('/', getUsers);
// usersRouter.get('/:userId', validateGetUserById, getUserById);

module.exports = usersRouter;
