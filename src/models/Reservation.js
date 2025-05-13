const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  dateHeure: { type: Date, required: true },
  voitureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);