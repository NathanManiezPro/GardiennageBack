const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // 📋 Récupérer toutes les voitures
  getAll: async (_req, res) => {
    try {
      const cars = await prisma.car.findMany();
      res.json(cars);
    } catch (err) {
      console.error('❌ Erreur Prisma :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des voitures.', details: err.message });
    }
  },

  // 🏎️ Récupérer une voiture par son ID
  getById: async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      if (isNaN(carId)) {
        return res.status(400).json({ error: 'L\'ID de la voiture doit être un nombre valide.' });
      }

      const car = await prisma.car.findUnique({ where: { id: carId } });
      if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });

      res.json(car);
    } catch (err) {
      console.error('❌ Erreur Prisma :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de la voiture.', details: err.message });
    }
  },

  // 🚗 Créer une nouvelle voiture
  create: async (req, res) => {
    const { marque, modele, annee, plaqueImmatriculation, dateEntree, statut, clientId } = req.body;

    if (!marque || !modele || !annee || !plaqueImmatriculation || !dateEntree || !statut || !clientId) {
      return res.status(400).json({ error: 'Tous les champs doivent être remplis.' });
    }

    try {
      const client = await prisma.user.findUnique({
        where: { id: parseInt(clientId) },
      });

      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }

      const car = await prisma.car.create({
        data: {
          marque,
          modele,
          annee: parseInt(annee),
          plaqueImmatriculation,
          dateEntree: new Date(dateEntree),
          statut,
          clientId: parseInt(clientId),
        },
      });

      res.status(201).json(car);
    } catch (err) {
      console.error('❌ Erreur lors de la création de la voiture :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la création de la voiture.', details: err.message });
    }
  },

  // ✏️ Mettre à jour une voiture
  update: async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      if (isNaN(carId)) {
        return res.status(400).json({ error: 'L\'ID de la voiture doit être un nombre valide.' });
      }

      const car = await prisma.car.findUnique({ where: { id: carId } });
      if (!car) {
        return res.status(404).json({ error: 'Voiture non trouvée' });
      }

      const { marque, modele, annee, plaqueImmatriculation, dateEntree, statut, clientId } = req.body;

      if (!marque || !modele || !annee || !plaqueImmatriculation || !dateEntree || !statut || !clientId) {
        return res.status(400).json({ error: 'Tous les champs doivent être remplis.' });
      }

      const client = await prisma.user.findUnique({
        where: { id: parseInt(clientId) },
      });

      if (!client) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }

      const updatedCar = await prisma.car.update({
        where: { id: carId },
        data: {
          marque,
          modele,
          annee: parseInt(annee),
          plaqueImmatriculation,
          dateEntree: new Date(dateEntree),
          statut,
          clientId: parseInt(clientId),
        },
      });

      res.json(updatedCar);
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour de la voiture :', err);
      res.status(400).json({ error: 'Erreur lors de la mise à jour de la voiture.', details: err.message });
    }
  },

  // ❌ Supprimer une voiture
  delete: async (req, res) => {
    try {
      const carId = parseInt(req.params.id);
      if (isNaN(carId)) {
        return res.status(400).json({ error: 'L\'ID de la voiture doit être un nombre valide.' });
      }

      const car = await prisma.car.findUnique({ where: { id: carId } });
      if (!car) {
        return res.status(404).json({ error: 'Voiture non trouvée' });
      }

      await prisma.car.delete({ where: { id: carId } });
      res.json({ message: 'Voiture supprimée' });
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de la voiture :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression de la voiture.', details: err.message });
    }
  },
};
