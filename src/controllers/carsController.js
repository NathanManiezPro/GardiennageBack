// controllers/carsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // 📋 Toutes les voitures (admin)
  getAll: async (_req, res) => {
    try {
      const cars = await prisma.car.findMany({
        include: { abonnements: true }
      });
      res.json(cars);
    } catch (err) {
      console.error('❌ getAll :', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 🚘 Voitures du client connecté
  getByUserId: async (req, res) => {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

    try {
      const cars = await prisma.car.findMany({
        where: { clientId: userId },
        include: { abonnements: true }
      });
      res.json(cars);
    } catch (err) {
      console.error('❌ getByUserId :', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 🏎️ Détail voiture (admin)
  getById: async (req, res) => {
    const carId = parseInt(req.params.id);
    if (isNaN(carId)) return res.status(400).json({ error: 'ID invalide' });

    try {
      const car = await prisma.car.findUnique({
        where: { id: carId },
        include: { abonnements: true }
      });
      if (!car) return res.status(404).json({ message: 'Voiture non trouvée' });
      res.json(car);
    } catch (err) {
      console.error('❌ getById :', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 🚗 Créer une voiture + abonnement (admin ou client)
  create: async (req, res) => {
    const {
      marque,
      modele,
      annee,
      plaqueImmatriculation,
      dateEntree,
      statut,
      clientId,
      abonnementType
    } = req.body;

    if (
      !marque ||
      !modele ||
      !annee ||
      !plaqueImmatriculation ||
      !dateEntree ||
      !statut ||
      !clientId
    ) {
      return res.status(400).json({ error: 'Tous les champs doivent être remplis.' });
    }

    try {
      const client = await prisma.user.findUnique({ where: { id: parseInt(clientId) } });
      if (!client) return res.status(404).json({ error: 'Client non trouvé' });

      const car = await prisma.car.create({
        data: {
          marque,
          modele,
          annee: parseInt(annee),
          plaqueImmatriculation,
          dateEntree: new Date(dateEntree),
          statut,
          clientId: parseInt(clientId),
          // dès qu'on a un abonnementType, on crée un abonnement lié
          ...(abonnementType && {
            abonnements: {
              create: {
                type: abonnementType,
                dateDebut: new Date(),
                dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
              },
            },
          }),
        },
        include: { abonnements: true },
      });

      res.status(201).json(car);
    } catch (err) {
      console.error('❌ create :', err);
      res.status(500).json({
        error: 'Erreur serveur lors de la création de la voiture.',
        details: err.message,
      });
    }
  },

  // ✏️ Mettre à jour une voiture et potentiellement ajouter un nouvel abonnement
  update: async (req, res) => {
    const carId = parseInt(req.params.id);
    if (isNaN(carId)) return res.status(400).json({ error: 'ID invalide' });

    const {
      marque,
      modele,
      annee,
      plaqueImmatriculation,
      dateEntree,
      statut,
      clientId,
      abonnementType
    } = req.body;

    if (
      !marque ||
      !modele ||
      !annee ||
      !plaqueImmatriculation ||
      !dateEntree ||
      !statut ||
      !clientId
    ) {
      return res.status(400).json({ error: 'Tous les champs doivent être remplis.' });
    }

    try {
      const existing = await prisma.car.findUnique({ where: { id: carId } });
      if (!existing) return res.status(404).json({ error: 'Voiture non trouvée' });

      const updated = await prisma.car.update({
        where: { id: carId },
        data: {
          marque,
          modele,
          annee: parseInt(annee),
          plaqueImmatriculation,
          dateEntree: new Date(dateEntree),
          statut,
          clientId: parseInt(clientId),
          // si abonnementType est fourni, on crée un nouvel abonnement
          ...(abonnementType && {
            abonnements: {
              create: {
                type: abonnementType,
                dateDebut: new Date(),
                dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
              },
            },
          }),
        },
        include: { abonnements: true },
      });

      res.json(updated);
    } catch (err) {
      console.error('❌ update :', err);
      res.status(500).json({
        error: 'Erreur serveur lors de la mise à jour de la voiture.',
        details: err.message,
      });
    }
  },

  // ❌ Supprimer une voiture (admin)
  delete: async (req, res) => {
    const carId = parseInt(req.params.id);
    if (isNaN(carId)) return res.status(400).json({ error: 'ID invalide' });

    try {
      await prisma.car.delete({ where: { id: carId } });
      res.json({ message: 'Voiture supprimée' });
    } catch (err) {
      console.error('❌ delete :', err);
      res.status(500).json({
        error: 'Erreur serveur lors de la suppression de la voiture.',
        details: err.message,
      });
    }
  },
};
