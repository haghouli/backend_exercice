require('dotenv').config();

const saltRounds = 10;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;  

module.exports = {
    saltRounds,
    JWT_SECRET_KEY
}