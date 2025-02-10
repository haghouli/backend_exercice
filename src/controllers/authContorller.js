const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { saltRounds, JWT_SECRET_KEY} = require('../constants/constants');
const prisma = require('../prisma/prisma')

const { Prisma } = require('@prisma/client')

const { validateEmail, validatePassword } = require('../helpers/tools')


/*
    login arrow function
*/
const login = async (req, res) => {
    
    try {
    
        const { email, password } = req.body;
        
        if(email == undefined || password == undefined) {
            return res.status(400).json({ 'error': "invalid email or password" });
        }

        // check if the email exist in the database
        const user = await prisma.getUserByEmail(email);
        if(!user) {
            return res.status(404).json({'error': 'email does not exist'});
        }
        
        // verify password usign the bcryot compare
        const verifyPassword = await bcrypt.compare(password, user.password);
        if(!verifyPassword) {
            return res.status(401).json({'error': 'incorrect'});
        }

        // create token of the user
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET_KEY,
            { expiresIn: '30m'}
        )

        return res.json({ "token": token });

    } catch(error) {
        return res.status(500).json({
            'error': 'An error occures'
        })
    }

}


/*
    register arrow function
    take request and response
*/
const register = async (req, res) => {
    
    try {
        
        const { name, email, password, role } = req.body;

        // check for undefind field
        if(name == undefined || email == undefined || password == undefined) {
            return res.status(400).json({ 'error': 'bad request' });
        }

        // validate email
        if(!validateEmail(email)) {
            return res.status(400).json({'error': "invlaid email"});
        }

        // validate passwod
        if(!validatePassword(password)) {
            return res.status(400).json({
                'error': "passowrd should contain at least a symbol, upper and lower case letters and a number"
            });
        }

        // validate the givern role
        const roles = ['USER', 'ADMIN'];
        if(role && !roles.includes(role)){
            return res.status(400).json({ "error": "invalid role" });
        }
        
        // hash and save the password
        const hash = await bcrypt.hash(password, saltRounds)

        if(!hash) throw 'error'

        const user = await prisma.saveUser(name, email, hash, role);
        if(!user) {
            res.json({ 'error': 'error while saving user' })
        }
        
        return res.json({ 'message': 'User register success' });
    } catch (error){

        // return 400 if the email alreay exist on the database
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(400).json({
                    "error": "email already exist"
                })
            }
        }

        res.status(500).json({'error': 'an error occures'})
    }
}


// this only for test
const getUsers = async (req, res) => {
    try {
        const users = await prisma.getUsers();
        return res.json(users);
    } catch(error) {
        return res.status(500).json({'error': 'An error occures'});
    }
}

module.exports = { login, register, getUsers };