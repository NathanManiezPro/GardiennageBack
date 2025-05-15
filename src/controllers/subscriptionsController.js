const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getAll: async (_req, res) => {
    try {
      const abonnements = await prisma.abonnement.findMany();
      res.json(abonnements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const abonnement = await prisma.abonnement.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!abonnement) return res.status(404).json({ message: 'Abonnement non trouvé' });
      res.json(abonnement);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { dateDebut, dateFin, type, clientId } = req.body;
      const abonnement = await prisma.abonnement.create({
        data: {
          dateDebut: new Date(dateDebut),
          dateFin: new Date(dateFin),
          type,
          clientId: parseInt(clientId)
        }
      });
      res.status(201).json(abonnement);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const abonnement = await prisma.abonnement.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      res.json(abonnement);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await prisma.abonnement.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.json({ message: 'Abonnement supprimé' });
    } catch (err) {
      res.status(404).json({ error: 'Abonnement non trouvé' });
    }
  }
};