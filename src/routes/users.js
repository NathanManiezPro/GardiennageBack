const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/verifyToken');

// Routes publiques
router.post('/register', usersController.register);
router.post('/login', usersController.login);

// Routes protégées
router.get('/', verifyToken, usersController.getAll);
router.put('/:id', verifyToken, usersController.update);
router.delete('/:id', verifyToken, usersController.delete);

module.exports = router;
