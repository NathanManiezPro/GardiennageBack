const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getAll: async (_req, res) => {
    try {
      const tickets = await prisma.ticket.findMany();
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
      res.json(ticket);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { type, dateCreation, statut, voitureId } = req.body;
      const ticket = await prisma.ticket.create({
        data: {
          type,
          dateCreation: new Date(dateCreation),
          statut,
          voitureId: parseInt(voitureId)
        }
      });
      res.status(201).json(ticket);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const ticket = await prisma.ticket.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      res.json(ticket);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await prisma.ticket.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.json({ message: 'Ticket supprimé' });
    } catch (err) {
      res.status(404).json({ error: 'Ticket non trouvé' });
    }
  }
};