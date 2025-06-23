// src/routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


// Routes publiques
router.post('/register', usersController.register);
router.post('/login', usersController.login);

// Route GET manquante pour lister les utilisateurs
router.get('/', usersController.getAll);

// Route PUT pour mise à jour
router.put('/:id', usersController.update);

router.delete('/:id', usersController.delete); // 👈 à ajouter

module.exports = router;
