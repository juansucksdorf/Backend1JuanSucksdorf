const fs = require('fs/promises',);
const express = require("express");
const router = express.Router();
const path = require('path');
const ProductManager = require('../managers/productManager');
const CartManager = require("../managers/cartManager");

const productsFilePath = path.join(__dirname, '../../assets/productos.json');
const productManager = new ProductManager(productsFilePath);

const cartsFilePath = path.join(__dirname, '../../assets/Carritos.json');


const cartManager = new CartManager(cartsFilePath, productManager);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (_, res) => {
  try {
    const newCart = await cartManager.createCart();

    res
      .status(200)
      .json({
        success: true,
        message: "Carrito creado correctamente.",
        cart: newCart,
      });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        error: "Error al crear carrito.",
        message: err.message,
      });
  }
});
router.get('/all', async (_, res) => {
  try {
    const carts = await cartManager.getCarts(); 
    res.status(200).json({ success: true, carts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al obtener los carritos.', message: err.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      res
        .status(404)
        .json({
          success: false,
          error: "Carrito inexistente con ID " + req.params.cid,
        });
      return;
    }

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        error: "Error al obtener carrito con ID " + req.params.cid,
        message: err.message,
      });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
      res
        .status(400)
        .json({ success: false, error: "Los IDs deben ser números válidos." });
      return;
    }

    const quantity = req.body.quantity || 1;

    await cartManager.addToCart(cartId, productId, quantity);

    res
      .status(200)
      .json({
        success: true,
        message: "Producto agregado al carrito correctamente.",
      });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        error: "Error al agregar producto al carrito.",
        message: err.message,
      });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const updatedCart = await cartManager.updateCart(cartId, req.body);

    res.status(200).json({
      success: true,
      message: "Carrito actualizado correctamente.",
      cart: updatedCart,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Error al actualizar carrito.",
      message: err.message,
    });
  }
});


module.exports = router;
