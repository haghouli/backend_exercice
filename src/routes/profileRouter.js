const express = require('express')

const profileRouter = express.Router()

const { 
    getUserController,
    deleteUserController,
    updateUserController
} = require('../controllers/profileController');

const authMidleware = require('../midlewares/authMidleware');

profileRouter.get('/profile', authMidleware, getUserController);
profileRouter.delete('/profile', authMidleware, deleteUserController);
profileRouter.put('/profile', authMidleware, updateUserController);

module.exports = profileRouter;