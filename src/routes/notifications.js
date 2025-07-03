// src/routes/notifications.js
const express      = require('express');
const router       = express.Router();
const verifyToken  = require('../middlewares/verifyToken');
const verifyAdmin  = require('../middlewares/verifyAdmin');
const ctrl         = require('../controllers/notificationsController');

router.use(verifyToken);

// chaque utilisateur ne lit que ses notifs
router.get('/',            ctrl.getAll);
router.get('/:id',         ctrl.getById);

// création (admin seulement)
router.post('/',           verifyAdmin, ctrl.create);

// marquer comme lue
router.put('/:id/read',    ctrl.markAsRead);

// suppression (admin seulement)
router.delete('/:id',      verifyAdmin, ctrl.delete);

module.exports = router;
