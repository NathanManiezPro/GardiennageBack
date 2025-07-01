// src/routes/users.js
const express         = require('express');
const router          = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken     = require('../middlewares/verifyToken');
const verifyAdmin     = require('../middlewares/verifyAdmin');

// Routes publiques
router.post('/register', usersController.register);
router.post('/login',    usersController.login);

// Routes protégées
router.get('/',           verifyToken, verifyAdmin, usersController.getAll);   // 🛡️ admin seulement
router.put('/:id',        verifyToken,                   usersController.update);
router.delete('/:id',     verifyToken, verifyAdmin,     usersController.delete); // 🛡️ admin seulement

// 🚀 Changer son propre mot de passe
router.patch(
  '/me/password',
  verifyToken,
  usersController.changePassword
);

module.exports = router;
