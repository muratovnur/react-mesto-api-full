require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { validateCreateUser, validateLogin } = require('./middlewares/validations');
const { jwtVerify } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/not-found-error');

const { DATABASE_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb', PORT = 3001 } = process.env;

const app = express();

mongoose.connect(DATABASE_ADDRESS);

app.use(cors({ origin: ['http://localhost:3000', 'http://mesto-nurbol.students.nomoredomainsclub.ru', 'https://mesto-nurbol.students.nomoredomainsclub.ru'], credentials: true, maxAge: 600 }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(jwtVerify);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/', (req, res, next) => next(new NotFoundError('По указанному пути ничего не найдено.')));

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT);
