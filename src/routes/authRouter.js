const express = require('express');
const authRouter = express.Router();

const { login, register, getUsers } = require('../controllers/authContorller');

const authMidleware = require('../midlewares/authMidleware');
const roleMidelware = require('../midlewares/roleMidleware');

const rateLimit = require('express-rate-limit');

const rateTime = 1;

const loginLimiter = rateLimit({
    windowMs: rateTime * 60 * 1000,
    max: 5,
    message: `Too many login attempts from this IP, please try again after ${ rateTime } minutes`,
    statusCode: 429,
});


authRouter.post('/register', register);
authRouter.post('/login', loginLimiter, login);
authRouter.get('/users', authMidleware, roleMidelware, getUsers);

module.exports = authRouter;