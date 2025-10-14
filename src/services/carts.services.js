import Cart from "../dao/models/cart.model.js";
import Product from "../dao/models/products.model.js";

class CartService {
  async addProductToCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const product = await Product.findById(pid);
    if (!product) throw new Error("Producto no encontrado");

    const index = cart.products.findIndex((p) => p.product.toString() === pid);

    if (index !== -1) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async incrementProductQuantity(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const productInCart = cart.products.find(
      (p) => p.product.toString() === pid
    );
    if (!productInCart) return null;

    productInCart.quantity += 1;
    await cart.save();
    return cart;
  }

  async decrementProductQuantity(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (productIndex === -1) return null;

    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1); // elimina el producto si queda en 0
    }

    await cart.save();
    return cart;
  }
}

export const cartService = new CartService();
