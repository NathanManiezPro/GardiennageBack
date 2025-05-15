const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  register: async (req, res) => {
    const { nom, email, telephone, password } = req.body;
    try {
      const user = await prisma.user.create({
        data: { nom, email, telephone, password }
      });
      res.status(201).json({ message: 'Inscription réussie', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }
      res.json({ message: 'Connexion réussie', user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAll: async (_req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};