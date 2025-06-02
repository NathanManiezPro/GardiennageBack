// src/controllers/carsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getAll: async (_req, res) => {
    try {
      const cars = await prisma.car.findMany();
      res.json(cars);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const car = await prisma.car.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
      res.json(car);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { modele, plaqueImmatriculation, dateEntree, statut, clientId } = req.body;
      const car = await prisma.car.create({
        data: { modele, plaqueImmatriculation, dateEntree: new Date(dateEntree), statut, clientId: parseInt(clientId) }
      });
      res.status(201).json(car);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const car = await prisma.car.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      res.json(car);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await prisma.car.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.json({ message: 'Voiture supprimée' });
    } catch (err) {
      res.status(404).json({ error: 'Voiture non trouvée' });
    }
  }
};
