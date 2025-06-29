// controllers/ticketsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔁 Get all tickets avec user + car info
const getAll = async (_req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { user: true, car: true },
      orderBy: { dateCreation: 'desc' },
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔎 Get ticket by ID avec user + car
const getById = async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  if (isNaN(ticketId)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { user: true, car: true },
    });
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Create new ticket + include relations
const create = async (req, res) => {
  try {
    const { type, message, voitureId, clientId } = req.body;

    const ticket = await prisma.ticket.create({
      data: {
        type,
        message,
        voitureId: parseInt(voitureId, 10),
        clientId: parseInt(clientId, 10),
      },
      include: { user: true, car: true },
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✏️ Update ticket (admin) + include relations
const update = async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  const { statut, adminResponse } = req.body;

  if (isNaN(ticketId)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { statut, adminResponse },
      include: { user: true, car: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 💬 Réponse client → route PUT /tickets/:id/client-response
//    On ne touche plus au statut, on stocke juste `clientResponse`
const clientRespond = async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  const { clientResponse } = req.body;  

  if (isNaN(ticketId)) return res.status(400).json({ error: 'ID invalide' });
  if (typeof clientResponse !== 'string') {
    return res.status(400).json({ error: 'clientResponse manquant' });
  }

  try {
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { clientResponse },
      include: { user: true, car: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la réponse du client." });
  }
};

// ❌ Delete ticket
const deleteTicket = async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  if (isNaN(ticketId)) return res.status(400).json({ error: 'ID invalide' });

  try {
    await prisma.ticket.delete({ where: { id: ticketId } });
    res.json({ message: 'Ticket supprimé' });
  } catch (err) {
    res.status(404).json({ error: 'Ticket non trouvé' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteTicket,
  clientRespond,
};
