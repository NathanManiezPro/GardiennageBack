let notifications = [];

module.exports = {
  getAll: (_req, res) => res.json(notifications),

  getById: (req, res) => {
    const n = notifications.find(n => n.id == req.params.id);
    if (!n) return res.status(404).json({ message: 'Notification non trouvée' });
    res.json(n);
  },

  create: (req, res) => {
    const { clientId, message, dateTime } = req.body;
    const newNotif = { id: notifications.length + 1, clientId, message, dateTime, statutLecture: false };
    notifications.push(newNotif);
    res.status(201).json(newNotif);
  },

  markAsRead: (req, res) => {
    const notif = notifications.find(n => n.id == req.params.id);
    if (!notif) return res.status(404).json({ message: 'Notification non trouvée' });
    notif.statutLecture = true;
    res.json({ message: 'Notification marquée comme lue', notif });
  },

  delete: (req, res) => {
    const index = notifications.findIndex(n => n.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Notification non trouvée' });
    const removed = notifications.splice(index, 1);
    res.json({ message: 'Notification supprimée', removed });
  }
};
