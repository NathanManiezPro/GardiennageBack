// src/routes/reservations.js
const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');

router.get('/', reservationsController.getAll);
router.get('/:id', reservationsController.getById);
router.post('/', reservationsController.create);
router.put('/:id', reservationsController.update);
router.delete('/:id', reservationsController.delete);

module.exports = router;
