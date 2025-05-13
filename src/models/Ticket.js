const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  type: { type: String, required: true },
  dateCreation: { type: Date, required: true },
  statut: { type: String, required: true },
  voitureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }
});

module.exports = mongoose.model('Ticket', ticketSchema);