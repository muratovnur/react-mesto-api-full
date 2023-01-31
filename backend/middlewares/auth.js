const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorized-error');

const { NODE_ENV = 'dev', JWT_SECRET } = process.env;

const jwtVerify = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }
  else {
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV !== 'production' ? 'dev-secret' : JWT_SECRET);
      req.user = payload;

      next();
    }
    catch (err) {
      next(new UnauthorizedError('Необходима авторизация.'));
    }
  }
};

module.exports = { jwtVerify };
