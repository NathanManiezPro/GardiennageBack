const mongoose = require('mongoose');

const historiqueSchema = new mongoose.Schema({
  dateIntervention: { type: Date, required: true },
  description: { type: String, required: true },
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true }
});

module.exports = mongoose.model('HistoriqueIntervention', historiqueSchema);