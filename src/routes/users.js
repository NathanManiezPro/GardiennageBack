const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin'); // ✅ ajouter

// Routes publiques
router.post('/register', usersController.register);
router.post('/login', usersController.login);

// Routes protégées
router.get('/', verifyToken, verifyAdmin, usersController.getAll); // 🛡️ admin seulement
router.put('/:id', verifyToken, usersController.update);
router.delete('/:id', verifyToken, verifyAdmin, usersController.delete); // 🛡️ admin seulement

module.exports = router;
