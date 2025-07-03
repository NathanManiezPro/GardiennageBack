// src/middlewares/passwordRegex.js

// Regex : min. 8 caractères, au moins 1 chiffre et 1 caractère spécial
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

module.exports = PASSWORD_REGEX;
