const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  modele: { type: String, required: true },
  plaqueImmatriculation: { type: String, required: true },
  dateEntree: { type: Date, required: true },
  statut: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Car', carSchema);