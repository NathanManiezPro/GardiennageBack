// src/models/Notification.js
const { Schema, model } = require('mongoose');

const notificationSchema = new Schema({
  clientId: {
    type: Number,    // On reprend l’ID numérique de ton utilisateur Prisma
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  dateEnvoi: {
    type: Date,
    default: Date.now,
  },
  statutLecture: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('Notification', notificationSchema);
