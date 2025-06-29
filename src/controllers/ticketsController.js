const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔁 Get all tickets with user + car info
const getAll = async (_req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: true,
        car: true,
      },
      orderBy: {
        dateCreation: 'desc',
      },
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔎 Get ticket by ID
const getById = async (req, res) => {
  const ticketId = parseInt(req.params.id);
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: true,
        car: true,
      },
    });
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ➕ Create new ticket
const create = async (req, res) => {
  try {
    const { type, message, voitureId, clientId } = req.body;

    const ticket = await prisma.ticket.create({
      data: {
        type,
        message,
        voitureId: parseInt(voitureId),
        clientId: parseInt(clientId),
      },
      include: {
        user: true,
        car: true,
      },
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✏️ Update ticket (admin)
const update = async (req, res) => {
  const ticketId = parseInt(req.params.id);
  const { statut, adminResponse } = req.body;

  try {
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        statut,
        adminResponse,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 💬 Réponse client
const clientRespond = async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  const { clientResponse } = req.body;

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        clientResponse,
        statut: 'Réponse client',
      },
    });

    res.json(updatedTicket);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la réponse du client." });
  }
};

// ❌ Delete ticket
const deleteTicket = async (req, res) => {
  const ticketId = parseInt(req.params.id);
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
