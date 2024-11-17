import  { TicketDAO } from '../dao/TicketDAO.js';
import { v4 as uuidv4 } from 'uuid';

class TicketController {
    async createTicket(req, res) {
        try {
        const { amount, purchaser } = req.body;

        const ticketData = {
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount,
            purchaser
        };

        const ticket = await TicketDAO.create(ticketData);

        res.status(201).json({
            message: 'Ticket creado exitosamente',
            ticket
        });
        } catch (error) {
        console.error("Error al crear el ticket:", error);
        res.status(500).json({ message: 'Error al crear el ticket' });
        }
    }

    async getTicketById(req, res) {
        try {
        const { id } = req.params;
        const ticket = await TicketDAO.getById(id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }

        res.status(200).json(ticket);
        } catch (error) {
        console.error("Error al obtener el ticket:", error);
        res.status(500).json({ message: 'Error al obtener el ticket' });
        }
    }

    async getAllTickets(req, res) {
        try {
        const tickets = await TicketDAO.getAll();
        res.status(200).json(tickets);
        } catch (error) {
        console.error("Error al obtener los tickets:", error);
        res.status(500).json({ message: 'Error al obtener los tickets' });
        }
    }
}

export default new TicketController();
