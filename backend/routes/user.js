const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth'); // jika ada

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticate, userController.profile);
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;