// src/controllers/notificationsController.js
const Notification = require('../models/Notification');

module.exports = {
  // GET /notifications
  getAll: async (req, res) => {
    try {
      const userId = req.user.id;
      const notes = await Notification
        .find({ clientId: userId })
        .sort('-dateEnvoi');
      return res.json(notes);
    } catch (err) {
      console.error('❌ getAll notifications:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // GET /notifications/:id
  getById: async (req, res) => {
    try {
      const note = await Notification.findOne({
        _id: req.params.id,
        clientId: req.user.id
      });
      if (!note) return res.status(404).json({ message: 'Notification non trouvée.' });
      return res.json(note);
    } catch (err) {
      console.error('❌ getById notification:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // POST /notifications (admin)
  create: async (req, res) => {
    try {
      const { clientId, message, dateEnvoi } = req.body;
      if (!clientId || !message) {
        return res.status(400).json({ message: 'clientId et message requis.' });
      }
      const notif = await Notification.create({
        clientId,
        message,
        dateEnvoi: dateEnvoi || Date.now(),
      });
      return res.status(201).json(notif);
    } catch (err) {
      console.error('❌ create notification:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // PUT /notifications/:id/read
  markAsRead: async (req, res) => {
    try {
      const note = await Notification.findOneAndUpdate(
        { _id: req.params.id, clientId: req.user.id },
        { statutLecture: true },
        { new: true }
      );
      if (!note) return res.status(404).json({ message: 'Notification non trouvée.' });
      return res.json({ message: 'Notification marquée comme lue.', note });
    } catch (err) {
      console.error('❌ markAsRead notification:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // DELETE /notifications/:id (admin)
  delete: async (req, res) => {
    try {
      const note = await Notification.findByIdAndDelete(req.params.id);
      if (!note) return res.status(404).json({ message: 'Notification non trouvée.' });
      return res.json({ message: 'Notification supprimée.', note });
    } catch (err) {
      console.error('❌ delete notification:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },
};
