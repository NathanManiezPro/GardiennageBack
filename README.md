# 🚗 API Gardiennage Automobile

Application développée dans le cadre du titre professionnel **CDA 2025** (Concepteur Développeur d’Applications), permettant de gérer des voitures en gardiennage, des tickets de maintenance, des abonnements et plus encore.

---

## ✅ Objectifs pédagogiques

Cette application permet de valider les blocs de compétences suivants :

- ✅ Développer une application sécurisée
- ✅ Concevoir et développer une application sécurisée organisée en couches
- ✅ Préparer le déploiement d’une application sécurisée
- ✅ Implémenter la persistance des données (MongoDB + PostgreSQL)
- ✅ Documenter une API REST (Swagger)

---

## ⚙️ Technologies utilisées

| Frontend  | Backend       | BDD SQL        | BDD NoSQL     | Auth / Tests      |
|-----------|----------------|----------------|----------------|--------------------|
| React.js  | Express.js     | PostgreSQL     | MongoDB        | Swagger / Cypress  |
| JSX       | Node.js        | Prisma ORM     | Mongoose       | (à venir)          |
| Tailwind  | Docker         |                |                |                    |

---

## 🧰 Dépendances installées

```bash
npm install express mongoose prisma @prisma/client dotenv
npm install swagger-ui-express yaml
npm install --save-dev nodemon
```

---

## 📦 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/tonpseudo/backend-projet.git
cd backend-projet
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l’environnement

Créer un fichier `.env` :

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/garage
DATABASE_URL="postgresql://admin:CarGarage_2025!@localhost:5432/garage?schema=public"
```

> Un fichier `env.example` est fourni pour t’aider.

---

## ⚙️ Scripts disponibles

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

---

## ▶️ Lancer le projet

```bash
docker compose up -d      # Lance PostgreSQL
npx prisma generate       # Génère le client Prisma
npm run dev               # Démarre le backend
```

- [http://localhost:3000](http://localhost:3000)
- [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📘 Documentation Swagger

L’API est entièrement documentée via un fichier `swagger.yaml`.

### Exemple :

```yaml
/cars:
  get:
    summary: Liste toutes les voitures
    tags:
      - Cars
    responses:
      '200':
        description: Succès
```

---

## 📸 Tests API

- Postman (requêtes manuelles CRUD)
- Swagger (interface intégrée : Try it out)

---

## 📂 Structure du projet

```
backend-projet/
├── prisma/
│   ├── schema.prisma
│   └── .gitignore
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/              # MongoDB uniquement
│   ├── middlewares/
│   └── app.js
├── swagger.yaml
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🧠 À venir

- Tests automatisés (Jest + Cypress)
- Authentification JWT
- Frontend client & admin
- Déploiement Docker complet

---

## 👤 Auteur

Projet réalisé par **Nathan Maniez**  
Formation : CDA 2025  
📅 Année : 2025  
📍 Centre de formation : *M2i Formation*