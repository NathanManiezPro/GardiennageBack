const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  dateTime: { type: Date, required: true },
  statutLecture: { type: Boolean, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Notification', notificationSchema);