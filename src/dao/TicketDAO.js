import { ticketModel } from './models/ticket.model.js';

class TicketDAO {
    async create(ticketData) {
        try {
        const ticket = ticketModel.create(ticketData);
        await ticket.save();
        return ticket;
        } catch (error) {
        console.error("Error al crear el ticket:", error);
        throw new Error("No se pudo crear el ticket");
        }
    }

    async getById(ticketId) {
        try {
        return await ticketModel.findById(ticketId);
        } catch (error) {
        console.error("Error al obtener el ticket:", error);
        throw new Error("No se pudo obtener el ticket");
        }
    }

    async getAll() {
        try {
        return await ticketModel.find();
        } catch (error) {
        console.error("Error al obtener todos los tickets:", error);
        throw new Error("No se pudieron obtener los tickets");
        }
    }
}

export default new TicketDAO();
