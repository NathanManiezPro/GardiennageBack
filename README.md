
# 🚗 API Gardiennage Automobile

Application développée dans le cadre du titre professionnel **CDA 2025** (Concepteur Développeur d’Applications), permettant de gérer des voitures en gardiennage, des tickets de maintenance, des abonnements et plus encore.

---

## ✅ Objectifs pédagogiques

Cette application permet de valider les blocs de compétences suivants :

- ✅ Développer une application sécurisée
- ✅ Concevoir et développer une application sécurisée organisée en couches
- ✅ Préparer le déploiement d’une application sécurisée
- ✅ Implémenter la persistance des données (MongoDB)
- ✅ Documenter une API REST (Swagger)

---

## 🛠️ Technologies utilisées

| Technologie | Description                            |
|-------------|----------------------------------------|
| Node.js     | Environnement d’exécution JavaScript   |
| Express.js  | Framework pour créer l’API REST        |
| MongoDB     | Base de données NoSQL                  |
| Mongoose    | ODM pour interagir avec MongoDB        |
| Swagger     | Documentation de l’API avec `swagger.yaml` |
| Dotenv      | Gestion des variables d’environnement   |
| Git / GitHub| Gestion de version                     |
| Postman     | Tests manuels de l’API                 |

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

---

## 🧰 Dépendances principales installées

```bash
npm install express mongoose dotenv
```

### Dépendances pour la documentation Swagger

```bash
npm install swagger-ui-express yaml
```

### Dépendance de développement

```bash
npm install --save-dev nodemon
```

---

## ⚙️ Scripts disponibles

Dans `package.json` :

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

---

## 🧪 Lancer le projet en local

1. Créer un fichier `.env` à la racine :

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/garage
```

2. Lancer l’API :

```bash
npm run dev
```

3. Accéder à l’API :
- Base : [http://localhost:3000](http://localhost:3000)
- Swagger : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📘 Documentation Swagger

L’API est entièrement documentée via un fichier externe `swagger.yaml`.

### Pour voir la documentation :

```bash
http://localhost:3000/api-docs
```

### Exemple d'entrée `swagger.yaml` :

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

> Le fichier `swagger.yaml` est utilisé pour centraliser la documentation de manière propre et exportable.

---

## 📸 Tests API

Les tests peuvent être réalisés avec :
- Postman (requêtes manuelles CRUD)
- Swagger (interface de test intégrée avec bouton "Try it out")

---

## 📂 Structure du projet

```
backend-projet/
├── src/
│   ├── routes/         # Définition des endpoints
│   ├── controllers/    # Logique métier
│   ├── models/         # (à venir) Modèles Mongoose
│   ├── middlewares/    # Gestion des erreurs et auth
│   └── app.js          # Configuration de l’application
├── swagger.yaml        # Documentation Swagger externe
├── .env
├── package.json
└── README.md
```

---

## 👤 Auteur

Projet réalisé par **[Ton Prénom NOM]**  
Formation : CDA 2025  
📅 Année : 2025  
📍 Centre de formation : *à compléter*
