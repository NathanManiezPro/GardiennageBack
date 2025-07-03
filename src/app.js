// backend-projet/src/app.js
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const usersRoutes         = require('./routes/users');
const carsRoutes          = require('./routes/cars');
const ticketsRoutes       = require('./routes/tickets');
const subscriptionsRoutes = require('./routes/subscriptions');
const reservationsRoutes  = require('./routes/reservations');
const notificationsRoutes = require('./routes/notifications');
const errorHandler        = require('./middlewares/errorHandler');

const fs = require('fs');
const yaml = require('yaml');
const swaggerUi = require('swagger-ui-express');

const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

const app  = express();
const port = process.env.PORT || 3000;

// === 1. CORS : on lit l'URL du front depuis .env ===
const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3001';
app.use(cors({
  origin: FRONT_URL,
  credentials: true
}));

// Corps des requêtes en JSON
app.use(express.json());

// === 2. Tes routes ===
app.use('/users', usersRoutes);
app.use('/cars', carsRoutes);
app.use('/tickets', ticketsRoutes);
app.use('/subscriptions', subscriptionsRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/notifications', notificationsRoutes);

// === 3. Swagger docs ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// === 4. Connexion à MongoDB ===
const connectToDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log('🗄️  Connection URI utilisée =>', uri);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log('✔️  Connecté à MongoDB');
  } catch (err) {
    console.error('❌  Erreur de connexion MongoDB', err);
    process.exit(1);
  }
};
connectToDB();

// === 5. Route racine ===
app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenue sur mon API de gardiennage automobile !' });
});

// === 6. Gestionnaire d’erreurs ===
app.use(errorHandler);

// === 7. Démarrage du serveur ===
app.listen(port, () => {
  console.log(`🚀  Serveur démarré sur le port ${port}`);
});
