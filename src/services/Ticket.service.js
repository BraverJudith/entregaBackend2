import { TicketDAO } from "../dao/TicketDAO.js";

export class TicketService {
    static async createTicket(ticketData) {
        try {
            const ticket = await TicketDAO.createTicket(ticketData);
            return ticket;
        } catch (error) {
            console.error("Error al crear el ticket:", error);
            throw new Error("No se pudo crear el ticket");
        }
    }
}