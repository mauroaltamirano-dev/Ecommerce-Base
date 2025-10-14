import CustomRouter from "../helpers/CustomRouter.helper.js";
import Cart from "../dao/models/cart.model.js";
import Product from "../dao/models/products.model.js";
import Ticket from "../dao/models/ticket.model.js";
import { cartsService, ticketService } from "../services/products.services.js";
import logger from "../helpers/logger.helper.js";

class ViewsRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.read("/", ["PUBLIC"], this.home);
    this.read("/login", ["PUBLIC"], this.login);
    this.read("/register", ["PUBLIC"], this.register);
    this.read("/realtimeproducts", ["ADMIN"], this.realtimeProducts);
    this.read("/cart/:cid/buyCart", ["PUBLIC"], this.buyCart);
    this.read("/profile", ["USER", "ADMIN"], this.profile);
    this.read("/product/:pid", ["PUBLIC"], this.productDetail);
    this.read("/cart/:cid", ["PUBLIC"], this.cart);
    this.read("/ticket/:tid", ["PUBLIC"], this.ticketView);
  };

  buyCart = async (req, res) => {
    const { cid } = req.params;

    const carrito = await cartsService.readByIdWithPopulate(cid);
    if (!carrito) return res.status(404).send("Carrito no encontrado");

    const productos = carrito.products.map((p) => {
      const subtotal = p.quantity * p.product.price;
      return {
        title: p.product.title,
        price: p.product.price,
        quantity: p.quantity,
        subtotal,
      };
    });

    const total = productos.reduce((acc, p) => acc + p.subtotal, 0);

    res.render("comprar", {
      productos,
      total,
      carritoId: cid,
      style: ["comprar", "navbar", "global"],
    });
  };

  home = async (req, res, next) => {
    let cid = req.cookies.cid;
    let carrito = cid ? await Cart.findById(cid) : null;

    if (!carrito) {
      carrito = await Cart.create({});
      cid = carrito._id.toString();
      res.cookie("cid", cid, { httpOnly: false });
      logger.INFO("🛒 Nuevo carrito creado porque no existía ninguno.");
    }

    const { categoria } = req.query;

    let query = {};
    if (categoria) query.category = categoria;

    const productos = await Product.find(query).lean();
    const categorias = await Product.distinct("category");

    res.render("home", {
      productos,
      categorias,
      categoriaSeleccionada: categoria || "",
      carritoId: cid,
      style: ["home", "navbar", "global"],
    });
  };
  realtimeProducts = async (req, res, next) => {
    try {
      let cid = req.cookies.cid;
      if (!cid) {
        const carrito = await Cart.create({});
        cid = carrito._id.toString();
        res.cookie("cid", cid, { httpOnly: false });
      }

      const productos = await Product.find().lean();
      const categorias = Product.schema.path("category").enumValues;

      res.render("realTimeProducts", {
        productos,
        carritoId: cid,
        categorias,
        style: ["realTimeProducts", "navbar", "global"],
      });
    } catch (err) {
      next(err);
    }
  };

  login = (req, res) => {
    res.render("auth/login", {
      style: ["auth", "navbar", "global"],
      error: req.query.error,
      registroExitoso: req.query.registroExitoso,
    });
  };

  register = (req, res) => {
    res.render("register", {
      style: ["auth", "navbar", "global"],
    });
  };

  profile = (req, res) => {
    res.render("profile", {
      style: ["profile", "navbar", "global"],
    });
  };

  productDetail = async (req, res, next) => {
    try {
      let cid = req.cookies.cid;
      let carrito = cid ? await Cart.findById(cid) : null;

      if (!carrito) {
        carrito = await Cart.create({});
        cid = carrito._id.toString();
        res.cookie("cid", cid, { httpOnly: false });
        logger.INFO("🛒 Nuevo carrito creado porque no existía ninguno.");
      }

      const { pid } = req.params;
      const product = await Product.findById(pid).lean();

      if (!product)
        return res.status(404).render("errors/404", {
          mensaje: "Producto no encontrado",
          style: ["error", "global"],
        });

      res.render("productDetail", {
        carritoId: cid,
        producto: product,
        style: ["productDetail", "navbar", "global"],
      });
    } catch (err) {
      next(err);
    }
  };

  cart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const carrito = await Cart.findById(cid).populate("products.product");

      if (!carrito) {
        return res.status(404).render("errors/404", {
          mensaje: "Carrito no encontrado",
          style: ["error", "global"],
        });
      }

      res.render("cart", {
        carrito,
        productos: carrito.products,
        carritoId: cid,
        style: ["cart", "navbar", "global"],
      });
    } catch (err) {
      next(err);
    }
  };
  ticketView = async (req, res) => {
    const { tid } = req.params;
    try {
      const ticket = await Ticket.findById(tid)
        .populate("cartId.products.product")
        .lean();

      if (!ticket) {
        return res.status(404).render("errors/404", {
          mensaje: "Ticket no encontrado",
          style: ["error", "global"],
        });
      }

      res.render("ticket", {
        ticket,
        style: ["ticket", "navbar", "global"],
      });
    } catch (error) {
      console.error("❌ Error al cargar vista de ticket:", error);
      res.status(500).render("errors/500", {
        mensaje: "Error interno al cargar el ticket",
        style: ["error", "global"],
      });
    }
  };
}

export default new ViewsRouter().getRouter();
