let subscriptions = [];

module.exports = {
  getAll: (_req, res) => res.json(subscriptions),

  getById: (req, res) => {
    const sub = subscriptions.find(s => s.id == req.params.id);
    if (!sub) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.json(sub);
  },

  create: (req, res) => {
    const { clientId, type, dateDebut, dateFin } = req.body;
    const newSub = { id: subscriptions.length + 1, clientId, type, dateDebut, dateFin };
    subscriptions.push(newSub);
    res.status(201).json(newSub);
  },

  update: (req, res) => {
    const index = subscriptions.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Abonnement non trouvé' });
    subscriptions[index] = { ...subscriptions[index], ...req.body };
    res.json(subscriptions[index]);
  },

  remove: (req, res) => {
    const index = subscriptions.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Abonnement non trouvé' });
    const removed = subscriptions.splice(index, 1);
    res.json({ message: 'Abonnement supprimé', removed });
  }
};
