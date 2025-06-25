const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token reçu:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Ajoute l'utilisateur décodé à la requête

    // Vérifie si l'utilisateur est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit, rôle non autorisé' });
    }

    next(); // Passe à la route suivante si l'utilisateur est admin
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};
