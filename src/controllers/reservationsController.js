const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getAll: async (_req, res) => {
    try {
      const reservations = await prisma.reservation.findMany();
      res.json(reservations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
      res.json(reservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { dateHeure, voitureId, clientId } = req.body;
      const reservation = await prisma.reservation.create({
        data: {
          dateHeure: new Date(dateHeure),
          voitureId: parseInt(voitureId),
          clientId: parseInt(clientId)
        }
      });
      res.status(201).json(reservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const reservation = await prisma.reservation.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      res.json(reservation);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await prisma.reservation.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.json({ message: 'Réservation supprimée' });
    } catch (err) {
      res.status(404).json({ error: 'Réservation non trouvée' });
    }
  }
};