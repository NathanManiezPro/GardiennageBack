require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅

const usersRoutes   = require('./routes/users');
const carsRoutes    = require('./routes/cars');
const ticketsRoutes = require('./routes/tickets');
const errorHandler  = require('./middlewares/errorHandler');
const subscriptionsRoutes = require('./routes/subscriptions');
const reservationsRoutes  = require('./routes/reservations');
const notificationsRoutes = require('./routes/notifications');

const fs = require('fs');
const yaml = require('yaml');
const swaggerUi = require('swagger-ui-express');

const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

const app = express();
const port = process.env.PORT || 3000;

// 1. Middlewares globaux
app.use(cors({
  origin: 'http://localhost:5173', // ✅ autorise uniquement ton frontend React
  credentials: true                // ✅ autorise les cookies / sessions si besoin
}));
app.use(express.json());  // Nécessaire pour analyser le JSON dans les requêtes

// 2. Routes publiques
app.use('/users', usersRoutes);  // On garde cette route une seule fois
app.use('/cars', carsRoutes);
app.use('/tickets', ticketsRoutes);
app.use('/subscriptions', subscriptionsRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/notifications', notificationsRoutes);


// 3. Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 4. Connexion à MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    console.log('✔️  Connecté à MongoDB');
  } catch (err) {
    console.error('❌  Erreur de connexion MongoDB', err);
    process.exit(1); // Arrêter l'application si la connexion échoue
  }
};
connectToDB();

// 5. Route de base
app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenue sur mon API de gardiennage automobile !' });
});

// 6. Middleware de gestion d’erreurs
app.use(errorHandler);

// 7. Lancement du serveur
app.listen(port, () => {
  console.log(`🚀  Serveur démarré sur le port ${port}`);
});
