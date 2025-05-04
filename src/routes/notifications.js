const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationsController');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id/read', ctrl.markAsRead);
router.delete('/:id', ctrl.remove);

module.exports = router;
