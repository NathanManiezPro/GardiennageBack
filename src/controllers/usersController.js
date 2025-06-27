const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

module.exports = {
  // ➕ Inscription d'un utilisateur avec abonnement (facultatif pour admin)
  register: async (req, res) => {
    const { nom, email, telephone, password, role = 'client', typeAbonnement } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        nom,
        email,
        telephone,
        password: hashedPassword,
        role,
      };

      if (role === 'client' && typeAbonnement) {
        userData.abonnements = {
          create: {
            type: typeAbonnement,
            dateDebut: new Date(),
            dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        };
      }

      const user = await prisma.user.create({
        data: userData,
        include: { abonnements: true },
      });

      res.status(201).json({ message: 'Inscription réussie', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 🔐 Connexion avec génération de JWT
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({ message: 'Connexion réussie', token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 📋 Récupérer tous les utilisateurs
  getAll: async (_req, res) => {
    try {
      const users = await prisma.user.findMany({
        include: { abonnements: true },
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ✏️ Mise à jour utilisateur avec gestion de l'abonnement
  update: async (req, res) => {
    const userId = parseInt(req.params.id);
    const { nom, email, telephone, password, role, typeAbonnement } = req.body;

    try {
      const dataToUpdate = {
        nom,
        email,
        telephone,
        role,
      };

      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      // 🔁 Abonnement : mise à jour ou création si nécessaire
      if (role === 'client' && typeAbonnement) {
        const existingAbonnement = await prisma.abonnement.findFirst({
          where: { clientId: userId },
        });

        if (existingAbonnement) {
          await prisma.abonnement.update({
            where: { id: existingAbonnement.id },
            data: {
              type: typeAbonnement,
              dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
          });
        } else {
          await prisma.abonnement.create({
            data: {
              type: typeAbonnement,
              clientId: userId,
              dateDebut: new Date(),
              dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
          });
        }
      }

      res.json({ message: 'Utilisateur mis à jour', user: updatedUser });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // ❌ Suppression utilisateur
  delete: async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
      await prisma.user.delete({ where: { id: userId } });
      res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 🚗 Récupérer les voitures d’un utilisateur
  getUserCars: async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: 'ID invalide' });

    try {
      const cars = await prisma.car.findMany({
        where: { clientId: userId },
      });
      res.json(cars);
    } catch (err) {
      console.error('❌ Erreur récupération voitures client :', err);
      res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
  },
};
