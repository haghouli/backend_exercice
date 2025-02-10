const prisma = require('../prisma/prisma');

const getUserController = async (req, res) => {
    try {
        // get user id from the request
        const userId = req.user.id;

        // get the user data from the database by id
        const user = await prisma.getUserById(userId);
        // check is the user exist
        if(!user)
            return res.status(404).json({'error': 'user not found'});

        return res.json(user);

    } catch(error) {
        return res.status(500).json({'error': 'an error occures'});
    }
}

const updateUserController = async (req, res) => {
    
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        // check is the field are valid
        if(name == undefined || email == undefined)
            return res.status(400).json({'error': 'invalid request'});

        // check if the user exist in the database
        const isExist = prisma.getUserById(userId);
        if(!isExist)
            return res.status(404).json({'error': 'invalid user'});
        
        // update user
        const user = await prisma.updateUser(userId, name, email);
        if(!user)
            return res.status(500).json({"error": 'An error occures while updating user'})
        return res.json({ 'message': 'User updated successfully' })

    } catch(error) {
        return res.status(500).json({ "message": "An error occures" });
    }

}

const deleteUserController = async (req, res) => {

    try {

        const userId = req.user.id;
        const isExist = prisma.getUserById(userId);
        
        if(!isExist) 
            return res.status(404).json({'error': 'User not found'});

        const user = await prisma.deleteUser(userId);

        if(!user)
            return res.status(404).json({'error': 'User not found'})
        return res.json({ 'message': 'User deleted successfuly' });
    } catch(error) {
        return res.status(500).json({ 'error': 'An error occures' })
    }
}

module.exports = { 
    getUserController,
    updateUserController,
    deleteUserController
};