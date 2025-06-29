const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Toutes ces routes nécessitent un token valide
router.get('/', verifyToken, ticketsController.getAll);
router.get('/:id', verifyToken, ticketsController.getById);
router.post('/', verifyToken, ticketsController.create);

// Seul l’admin peut changer statut / réponse admin
router.put('/:id', verifyToken, verifyAdmin, ticketsController.update);

// Le client authentifié peut répondre côté client
router.put('/:id/client-response', verifyToken, ticketsController.clientRespond);

// Suppression (admin)
router.delete('/:id', verifyToken, verifyAdmin, ticketsController.delete);

module.exports = router;
