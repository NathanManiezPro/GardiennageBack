const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, carsController.getAll);
router.get('/:id', verifyToken, carsController.getById);
router.post('/', verifyToken, carsController.create);
router.put('/:id', verifyToken, carsController.update);
router.delete('/:id', verifyToken, carsController.delete);

module.exports = router;
