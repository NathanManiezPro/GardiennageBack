const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

module.exports = {
  // ➕ Inscription d'un utilisateur
  register: async (req, res) => {
    const { nom, email, telephone, password, role = 'client' } = req.body;

    try {
      // Vérifie si l'email existe déjà
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hash le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crée le nouvel utilisateur
      const user = await prisma.user.create({
        data: { nom, email, telephone, password: hashedPassword, role },
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
      // Recherche de l'utilisateur
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur introuvable' });
      }

      // Comparaison du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }

      // Génération du token JWT
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
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ✏️ Mise à jour utilisateur
  update: async (req, res) => {
    const userId = parseInt(req.params.id);
    const { nom, email, telephone, password, role } = req.body;

    try {
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          nom,
          email,
          telephone,
          password: hashedPassword,
          role,
        },
      });

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
};
