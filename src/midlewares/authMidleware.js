const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../constants/constants');

const  prisma  = require('../prisma/prisma');

const authMidleware = async (req, res, next) => {
    try {
        const AuthHeader = req.header('Authorization');
        if(!AuthHeader)
            return res.status(401).json({ 'error': 'Unauthorized' });
        
        const token = AuthHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);

        if(!decodedToken)
            return res.status(401).json({ 'error': 'Unauthorized' });

        const user = await prisma.getUserById(decodedToken.userId);
        if(!user)
            return res.status(401).json({ 'error': 'Unauthorized' });

        req.user = user;
        next();
    } catch(error) {
        return res.status(500).json({ 'error': 'An error occures' })
    }

}


module.exports = authMidleware