const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Routes
router.get('/', verifyToken, verifyAdmin, carsController.getAll); // admin uniquement
router.get('/my-cars', verifyToken, carsController.getByUserId);   // client connecté
router.get('/:id', verifyToken, carsController.getById);
router.post('/', verifyToken, verifyAdmin, carsController.create);
router.put('/:id', verifyToken, verifyAdmin, carsController.update);
router.delete('/:id', verifyToken, verifyAdmin, carsController.delete);

module.exports = router;
