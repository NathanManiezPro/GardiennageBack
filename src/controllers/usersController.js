// src/controllers/usersController.js
const { PrismaClient }   = require('@prisma/client');
const bcrypt             = require('bcrypt');
const jwt                = require('jsonwebtoken');
const PASSWORD_REGEX     = require('../middlewares/passwordRegex');

const prisma = new PrismaClient();

module.exports = {
  // ➕ Inscription
  register: async (req, res) => {
    const { nom, email, telephone, password, role = 'client', typeAbonnement } = req.body;
    try {
      // 1) Validation du format du mot de passe
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({
          message:
            'Le mot de passe doit comporter au moins 8 caractères, dont 1 chiffre et 1 caractère spécial.'
        });
      }

      // 2) Vérification de l’unicité de l’email
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      // 3) Hash du mot de passe et création de l’utilisateur
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = { nom, email, telephone, password: hashedPassword, role };

      if (role === 'client' && typeAbonnement) {
        userData.abonnements = {
          create: {
            type:      typeAbonnement,
            dateDebut: new Date(),
            dateFin:   new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        };
      }

      const user = await prisma.user.create({
        data:    userData,
        include: { abonnements: true },
      });

      return res.status(201).json({ message: 'Inscription réussie.', user });
    } catch (err) {
      // Pour toute autre erreur, on renvoie aussi "message"
      return res.status(500).json({ message: err.message });
    }
  },

  // 🔐 Connexion
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur introuvable.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.json({ message: 'Connexion réussie.', token, user });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // 📋 Récupérer tous les utilisateurs (admin)
  getAll: async (_req, res) => {
    try {
      const users = await prisma.user.findMany({ include: { abonnements: true } });
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // ✏️ Mettre à jour un utilisateur (admin ou self via PUT /:id)
  update: async (req, res) => {
    const userId = parseInt(req.params.id);
    const { nom, email, telephone, password, role, typeAbonnement } = req.body;
    try {
      const dataToUpdate = { nom, email, telephone, role };
      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data:  dataToUpdate,
      });

      // gestion de l’abonnement
      if (role === 'client' && typeAbonnement) {
        const existingSub = await prisma.abonnement.findFirst({ where: { clientId: userId } });
        if (existingSub) {
          await prisma.abonnement.update({
            where: { id: existingSub.id },
            data: {
              type:    typeAbonnement,
              dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
          });
        } else {
          await prisma.abonnement.create({
            data: {
              type:      typeAbonnement,
              clientId:  userId,
              dateDebut: new Date(),
              dateFin:   new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
          });
        }
      }

      return res.json({ message: 'Utilisateur mis à jour.', user: updatedUser });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // 🗑️ Supprimer un utilisateur (admin)
  delete: async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
      await prisma.user.delete({ where: { id: userId } });
      return res.json({ message: 'Utilisateur supprimé.' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // 🔒 Changer son mot de passe (self, PATCH /me/password)
  changePassword: async (req, res) => {
    try {
      const userId          = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis.' });
      }

      // Validation du format du nouveau mot de passe
      if (!PASSWORD_REGEX.test(newPassword)) {
        return res.status(400).json({
          message:
            'Le nouveau mot de passe doit comporter au moins 8 caractères, dont 1 chiffre et 1 caractère spécial.'
        });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Ancien mot de passe incorrect.' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

      return res.json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (err) {
      console.error('❌ changePassword:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // 📦 Récupérer les voitures d’un utilisateur
  getUserCars: async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: 'ID invalide.' });
    try {
      const cars = await prisma.car.findMany({ where: { clientId: userId } });
      return res.json(cars);
    } catch (err) {
      console.error('❌ getUserCars:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  },
};
