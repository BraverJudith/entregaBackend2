import { TicketDAO }   from '../dao/TicketDAO.js';
import { CartDAO }  from '../dao/CartDAO.js';


class TicketService {
  // Finalizar compra
    async finalizePurchase({ code, purchase_datetime, amount, purchaser, products }) {
        const ticket = await TicketDAO.create({
        code,
        purchase_datetime,
        amount,
        purchaser,
        products
        });
        //await CartDAO.clearCart(cart._id); 

        return ticket;
    }
}

export const ticketService = new TicketService();