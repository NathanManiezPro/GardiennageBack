# 🚗 API Gardiennage Automobile

Application backend développée dans le cadre du **Titre Professionnel CDA 2025** (Concepteur Développeur d’Applications).  
Elle permet la gestion sécurisée de véhicules en gardiennage, des tickets de maintenance, des réservations et des abonnements.

---

## ✅ Objectifs pédagogiques

Ce projet permet de valider plusieurs blocs de compétences du référentiel CDA :

- 🔒 Sécurisation d’une API (middleware, JWT, hashing des mots de passe)
- 🧱 Structuration MVC Express.js avec séparation des couches
- 🧰 Utilisation de deux bases de données : PostgreSQL (SQL) + MongoDB (NoSQL)
- 🧪 Mise en place de tests automatisés (Jest + couverture)
- 🚀 Déploiement via Docker & CI/CD (GitHub Actions, SonarQube, GHCR)
- 📖 Documentation Swagger complète de l’API REST

---

## ⚙️ Stack technique

| Frontend         | Backend     | Base SQL       | Base NoSQL   | Sécurité / Outils        |
|------------------|-------------|----------------|--------------|--------------------------|
| React + Vite     | Express.js  | PostgreSQL     | MongoDB      | JWT / Swagger / Docker   |
| Axios / CORS     | Node.js     | Prisma ORM     | Mongoose     | GitHub Actions / Sonar   |

---

## 📦 Installation

### 1. Cloner le repo

```bash
git clone https://github.com/NathanManiezPro/backend-projet.git
cd backend-projet
```

### 2. Installer les dépendances

```bash
# Dépendances principales
npm install express mongoose prisma @prisma/client dotenv bcrypt cors jsonwebtoken swagger-ui-express yaml

# Dépendances de dev
npm install --save-dev nodemon jest sonar-scanner

# Générer le client Prisma
npx prisma generate

### 3. Fichier `.env` attendu

```env
PORT=3000
FRONT_URL=http://localhost:3001

# MongoDB (conteneurisé ou local)
MONGO_URI=mongodb://admin:CarGarage_2025!@localhost:27017/garage?authSource=admin

# PostgreSQL
DATABASE_URL=postgresql://admin:CarGarage_2025!@localhost:5432/garage?schema=public

# Authentification
JWT_SECRET=Gardiennage_Secure_59!
```

---

## 🔧 Scripts disponibles

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js",
  "test": "jest --verbose",
  "coverage": "jest --coverage --coverageProvider=v8",
  "sonar": "sonar-scanner"
}
```

---

## ▶️ Lancement avec Docker

```bash
docker compose up -d     # Lance les conteneurs PostgreSQL, MongoDB
docker build -t backend-projet .  # Build l'image Docker backend
docker run -p 3000:3000 backend-projet  # Lance le conteneur backend
```

> ⚠️ Ne pas oublier `npx prisma generate` avant le build, ou à inclure dans l'image

---

## 📊 CI/CD GitHub Actions

Pipeline automatisé :
- ✅ Lancement des tests Jest + couverture
- 📦 Analyse de code avec SonarQube (`SONAR_TOKEN`)
- 🐳 Build + push de l'image Docker vers GitHub Container Registry (`DOCKER_USERNAME` / `DOCKER_PASSWORD`)

Workflow : `.github/workflows/ci-backend.yml`

---

## 📘 Swagger

- URL : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Fichier : `swagger.yaml`

---

## 🧪 Tests

- Unitaire : `npm run test`
- Couverture : `npm run coverage`
- E2E (à venir) : Cypress

---

## 📁 Arborescence

```
backend-projet/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── app.js
├── swagger.yaml
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 👨‍💻 Auteur

Projet réalisé par **Nathan Maniez**  
📅 Année : 2025  
🎓 CDA - M2i Formation  
🔗 GitHub : [NathanManiezPro](https://github.com/NathanManiezPro)# Trigger CI
