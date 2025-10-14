import CustomRouter from "../../helpers/CustomRouter.helper.js";
import { ticketController } from "../../controllers/controller.js";

class TicketRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/:cid", ["USER", "ADMIN"], ticketController.createFromCart);
  };
}

const ticketRouter = new TicketRouter();

export default ticketRouter.getRouter();
