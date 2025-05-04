// src/controllers/usersController.js

let users = [];

module.exports = {
  register: (req, res) => {
    const { nom, email, telephone, password } = req.body;
    if (!nom || !email || !password) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }
    const newUser = { id: users.length + 1, nom, email, telephone, password };
    users.push(newUser);
    res.status(201).json({ message: 'Inscription réussie', user: newUser });
  },

  login: (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    res.json({ message: 'Connexion réussie', token: 'fake-jwt-token' });
  }
};
