let reservations = [];

module.exports = {
  getAll: (_req, res) => res.json(reservations),

  getById: (req, res) => {
    const r = reservations.find(r => r.id == req.params.id);
    if (!r) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json(r);
  },

  create: (req, res) => {
    const { voitureId, clientId, dateHeure } = req.body;
    const newRes = { id: reservations.length + 1, voitureId, clientId, dateHeure };
    reservations.push(newRes);
    res.status(201).json(newRes);
  },

  update: (req, res) => {
    const index = reservations.findIndex(r => r.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Réservation non trouvée' });
    reservations[index] = { ...reservations[index], ...req.body };
    res.json(reservations[index]);
  },

  remove: (req, res) => {
    const index = reservations.findIndex(r => r.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Réservation non trouvée' });
    const removed = reservations.splice(index, 1);
    res.json({ message: 'Réservation supprimée', removed });
  }
};
