require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const usersRoutes   = require('./routes/users');
const carsRoutes    = require('./routes/cars');
const ticketsRoutes = require('./routes/tickets');
const errorHandler  = require('./middlewares/errorHandler');
const subscriptionsRoutes = require('./routes/subscriptions');
const reservationsRoutes  = require('./routes/reservations');
const notificationsRoutes = require('./routes/notifications');
const historyRoutes       = require('./routes/history');

const app = express();
const port = process.env.PORT || 3000;

// 1. Parser le JSON
app.use(express.json());

// 2. Connexion à MongoDB (si tu as configuré MONGO_URI dans .env)
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✔️  Connecté à MongoDB'))
  .catch(err => console.error('❌  Erreur de connexion MongoDB', err));

// 3. Déclaration des routes
app.use('/users', usersRoutes);   // inscription / login
app.use('/cars', carsRoutes);    
app.use('/tickets', ticketsRoutes);

app.use('/subscriptions', subscriptionsRoutes);
app.use('/reservations',  reservationsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/history', historyRoutes);

// 4. Route de base pour tester
app.get('/', (_req, res) => {
  res.send('Bienvenue sur mon API de gardiennage automobile !');
});

// 5. Middleware de gestion d’erreurs (toujours après les routes)
app.use(errorHandler);

// 6. Lancement du serveur
app.listen(port, () => {
  console.log(`🚀  Serveur démarré sur le port ${port}`);
});
