import Product from "./models/products.model.js";
import User from "./models/users.model.js";
import CartManager from "./managers/cart.manager.js";
import MongoManager from "./managers/mongo.manager.js";
import Ticket from "./models/ticket.model.js";

const productsManager = new MongoManager(Product);
const usersManager = new MongoManager(User);
const ticketManager = new MongoManager(Ticket);
const cartsManager = new CartManager();

export { productsManager, usersManager, cartsManager, ticketManager };
