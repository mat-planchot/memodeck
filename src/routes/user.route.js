const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin } = require('../middleware/validators/userValidator.middleware');

// localhost:3000/api/v1/users
router.get('/', auth(), awaitHandlerFactory(userController.getAllUsers)); 
router.get('/id/:id', auth(), awaitHandlerFactory(userController.getUserById)); // mandatory PARAM iduser
router.get('/username/:username', auth(), awaitHandlerFactory(userController.getUserByuserName)); // mandatory PARAM username
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser));
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser)); // mandatory POST email, password, confirm_password
router.patch('/id/:id', auth(Role.Admin), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // mandatory PARAM iduser
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // mandatory PARAM iduser
router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // mandatory POST email, password *** RETURN token ***

module.exports = router;