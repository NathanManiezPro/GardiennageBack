let tickets = [];

module.exports = {
  getAll: (_req, res) => {
    res.json(tickets);
  },

  getById: (req, res) => {
    const ticket = tickets.find(t => t.id == req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.json(ticket);
  },

  create: (req, res) => {
    const { voitureId, type } = req.body;
    const newTicket = {
      id: tickets.length + 1,
      voitureId,
      type,
      dateCreation: new Date(),
      statut: 'ouvert'
    };
    tickets.push(newTicket);
    res.status(201).json(newTicket);
  },

  update: (req, res) => {
    const { id } = req.params;
    const index = tickets.findIndex(t => t.id == id);
    if (index === -1) return res.status(404).json({ message: 'Ticket non trouvé' });
    tickets[index] = { ...tickets[index], ...req.body };
    res.json(tickets[index]);
  },

  remove: (req, res) => {
    const { id } = req.params;
    const index = tickets.findIndex(t => t.id == id);
    if (index === -1) return res.status(404).json({ message: 'Ticket non trouvé' });
    const removed = tickets.splice(index, 1);
    res.json({ message: 'Ticket supprimé', removed });
  }
};
