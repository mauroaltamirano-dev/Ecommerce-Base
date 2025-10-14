import {
  cartsService,
  productsServices,
} from "../services/products.services.js";

const cartCustomController = {
  readAllProducts: async (req, res) => {
    const { cid } = req.params;
    const carrito = await cartsService.readById(cid);
    if (!carrito)
      return res.status(404).json({ error: "Carrito no encontrado" });

    const promises = carrito.products.map(async (p) => {
      const productoCompleto = await productsServices.readById(p.product);
      return {
        ...productoCompleto.toObject(),
        quantity: p.quantity,
      };
    });

    const response = await Promise.all(promises);
    if (!response) return res.json404();
    res.json200(response);
  },

  readAllProductsPid: async (req, res) => {
    const { cid, pid } = req.params;
    const carrito = await cartsService.readById(cid);
    if (!carrito)
      return res.status(404).json({ mensaje: "Carrito no encontrado" });

    const item = carrito.products.find((p) => p.product.toString() === pid);
    if (!item)
      return res
        .status(404)
        .json({ mensaje: "Producto no está en el carrito" });

    res.json200(item);
  },

  addProductToCart: async (req, res) => {
    const { cid, pid } = req.params;
    const carrito = await cartsService.readById(cid);
    if (!carrito)
      return res.status(404).json({ error: "Carrito no encontrado" });

    const index = carrito.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (index !== -1) carrito.products[index].quantity += 1;
    else carrito.products.push({ product: pid, quantity: 1 });

    await carrito.save();
    res.json200(index);
  },

  incrementQuantity: async (req, res) => {
    const { cid, pid } = req.params;
    const carrito = await cartsService.readById(cid);
    if (!carrito)
      return res.status(404).json({ mensaje: "Carrito no encontrado" });

    const item = carrito.products.find((p) => p.product.toString() === pid);
    if (!item)
      return res
        .status(404)
        .json({ mensaje: "Producto no está en el carrito" });

    item.quantity += 1;
    await carrito.save();

    const producto = await productsServices.readById(pid);
    res.status(200).json({
      mensaje: "Cantidad actualizada",
      product: item.product,
      quantity: item.quantity,
      price: producto.price,
    });
  },

  decrementQuantity: async (req, res) => {
    const { cid, pid } = req.params;
    const carrito = await cartsService.readById(cid);
    if (!carrito)
      return res.status(404).json({ mensaje: "Carrito no encontrado" });

    const itemIndex = carrito.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (itemIndex === -1)
      return res
        .status(404)
        .json({ mensaje: "Producto no está en el carrito" });

    const item = carrito.products[itemIndex];
    const producto = await productsServices.readById(pid);
    let eliminado = false;

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      carrito.products.splice(itemIndex, 1);
      eliminado = true;
    }

    await carrito.save();

    res.status(200).json({
      mensaje: "Cantidad actualizada",
      product: pid,
      quantity: eliminado ? 0 : item.quantity,
      eliminado,
      price: producto.price,
    });
  },

  deleteOnTheCart: async (req, res) => {
    const { cid, pid } = req.params;
    if (cid && pid) {
      const carrito = await cartsService.readById(cid);
      if (!carrito)
        return res.status(404).json({ mensaje: "Carrito no encontrado" });

      const index = carrito.products.findIndex(
        (p) => p.product.toString() === pid
      );
      if (index === -1)
        return res
          .status(404)
          .json({ mensaje: "Producto no está en el carrito" });

      carrito.products.splice(index, 1);
      await carrito.save();

      return res.json({ mensaje: "Producto eliminado del carrito" });
    }
  },

  cleanCart: async (req, res) => {
    const { cid } = req.params;
    const carrito = await cartsService.readById(cid);
    if (!carrito)
      return res.status(404).json({ mensaje: "Carrito no encontrado" });

    carrito.products = [];
    await carrito.save();
    return res.json({ mensaje: "Carrito vaciado correctamente" });
  },

  validate: async (req, res) => {
    try {
      const { cid } = req.params;
      const carrito = await cartsService.readByIdWithPopulate(cid);

      if (!carrito) {
        return res.status(404).json({ 
          valido: false, 
          mensaje: "Carrito no encontrado" 
        });
      }

      const productosValidos = carrito.products.filter(
        p => p.product && p.product.title
      );

      if (productosValidos.length < carrito.products.length) {
        return res.status(400).json({
          valido: false,
          error: "Hay productos no disponibles",
          productos: [],
          total: 0
        });
      }

      return res.json({ valido: true });

    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ 
        valido: false, 
        mensaje: "Error interno" 
      });
    }
  },

  buyCart: async (req, res) => {
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

    carrito.products = [];
    await carrito.save();

    return res.render("comprar", {
      productos,
      total,
      fecha: new Date(),
    });
  },
};

export default cartCustomController;
