// src/controllers/reservationsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // 📋 Récupérer toutes les réservations (admin)
  getAll: async (_req, res) => {
    try {
      const reservations = await prisma.reservation.findMany({
        include: {
          user: true,
          car: true,
        },
        orderBy: {
          dateHeure: 'desc',
        },
      });
      res.json(reservations);
    } catch (err) {
      console.error('❌ Erreur récupération réservations :', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 🔎 Récupérer une réservation par ID (admin)
  getById: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
          user: true,
          car: true,
        },
      });
      if (!reservation) {
        return res.status(404).json({ message: 'Réservation non trouvée' });
      }
      res.json(reservation);
    } catch (err) {
      console.error('❌ Erreur récupération réservation :', err);
      res.status(500).json({ error: err.message });
    }
  },

  // ➕ Créer une nouvelle réservation (client)
  create: async (req, res) => {
    const { dateHeure, voitureId, clientId } = req.body;
    if (!dateHeure || !voitureId || !clientId) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
      const reservation = await prisma.reservation.create({
        data: {
          dateHeure: new Date(dateHeure),
          voitureId: parseInt(voitureId, 10),
          clientId: parseInt(clientId, 10),
          statut: 'En attente',
        },
        include: {
          user: true,
          car: true,
        },
      });
      res.status(201).json(reservation);
    } catch (err) {
      console.error('❌ Erreur création réservation :', err);
      res.status(400).json({ error: err.message });
    }
  },

  // ✏️ Mettre à jour une réservation (admin)
  update: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { statut, commentaire } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    try {
      const updated = await prisma.reservation.update({
        where: { id },
        data: {
          statut,
          commentaire,
        },
        include: {
          user: true,
          car: true,
        },
      });
      res.json(updated);
    } catch (err) {
      console.error('❌ Erreur mise à jour réservation :', err);
      res.status(400).json({ error: err.message });
    }
  },

  // ❌ Supprimer une réservation (admin)
  delete: async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    try {
      await prisma.reservation.delete({ where: { id } });
      res.json({ message: 'Réservation supprimée' });
    } catch (err) {
      console.error('❌ Erreur suppression réservation :', err);
      res.status(404).json({ error: 'Réservation non trouvée' });
    }
  },
};
