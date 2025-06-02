let history = [];

module.exports = {
  getAll: (_req, res) => res.json(history),

  getById: (req, res) => {
    const h = history.find(h => h.id == req.params.id);
    if (!h) return res.status(404).json({ message: 'Historique non trouvé' });
    res.json(h);
  },

  create: (req, res) => {
    const { ticketId, dateIntervention, description } = req.body;
    const newH = { id: history.length + 1, ticketId, dateIntervention, description };
    history.push(newH);
    res.status(201).json(newH);
  },

  update: (req, res) => {
    const index = history.findIndex(h => h.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Historique non trouvé' });
    history[index] = { ...history[index], ...req.body };
    res.json(history[index]);
  },

  delete: (req, res) => {
    const index = history.findIndex(h => h.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Historique non trouvé' });
    const removed = history.splice(index, 1);
    res.json({ message: 'Historique supprimé', removed });
  }
};
