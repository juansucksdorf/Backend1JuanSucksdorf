const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const path = require("path");
const ProductManager = require("./productManager");

class CartManager {
  constructor(cartsFilePath, productManager) {
    this.filePath = cartsFilePath;
    this.productManager = productManager;
    this.cart = [];
  }

  async initialize() {
    try {
      console.log("Iniciando CartManager...");
      await this.getCarts();
      console.log("CartManager inicializado correctamente.");
    } catch (error) {
      console.error("Error al inicializar CartManager:", error.message);
      throw error;
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const nextCartId = await this.getNextCartId();
      const newCart = {
        id: nextCartId,
        products: [],
      };

      carts.push(newCart);
      await this.saveCartsToFile(carts);

      return newCart;
    } catch (error) {
      console.error("Error al crear carrito:", error.message);
      throw error;
    }
  }
  
  
async getCarts() {
  try {
    console.log("Ruta del archivo de carritos:", this.filePath);

    const content = await readFileAsync(this.filePath, "utf-8");
    console.log("Contenido del archivo de carritos:", content);
    return JSON.parse(content);
  } catch (error) {
    console.error("Error al leer el archivo de carritos:", error.message);
    return [];
  }
}
  
  
  
async saveCartsToFile(carts) {
  try {
    await fs.writeFile(
      this.filePath,
      JSON.stringify(carts, null, 2),
      (err) => {
        if (err) {
          console.error("Error al guardar carritos en el archivo:", err.message);
          throw err;
        }

        console.log("Carritos guardados correctamente.");
      }
    );
  } catch (error) {
    console.error("Error al guardar carritos en el archivo:", error.message);
    throw error;
  }
}

  async addToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex !== -1) {
        // Verificar si el producto existe en el administrador de productos
        const product = await this.productManager.getProductById(productId);

        if (product) {
          const newProduct = {
            id: productId,
            quantity: quantity,
          };

          carts[cartIndex].products.push(newProduct);

          await this.saveCartsToFile(carts);

          console.log("Producto agregado al carrito correctamente.");
        } else {
          throw new Error("Producto no encontrado.");
        }
      } else {
        throw new Error("Carrito no encontrado.");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      console.log("Lista de carritos:", carts);

      const cartId = parseInt(id); 
      const cart = carts.find((cart) => cart.id === cartId);

      if (cart) {
        return cart;
      } else {
        throw new Error("Carrito no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener carrito por ID:", error.message);
      throw error;
    }
  }

  async getNextCartId() {
    try {
      const carts = await this.getCarts();
      const idMasAlto = carts.reduce(
        (maxId, cart) => (cart.id > maxId ? cart.id : maxId),
        0
      );
      return idMasAlto + 1;
    } catch (error) {
      console.error("Error al obtener carritos:", error.message);
      throw error;
    }
  }
  
async updateCart(cartId, updateData) {
  try {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      
      const updatedCart = { ...carts[cartIndex], ...updateData };
      carts[cartIndex] = updatedCart;

      await this.saveCartsToFile(carts);

      return updatedCart;
    } else {
      throw new Error("Carrito no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar carrito:", error.message);
    throw error;
  }
}

}

async function main() {
  try {
    const productManager = new ProductManager(
      path.join(__dirname, "../../assets/productos.json")
    );

    const cartManager = new CartManager(
      path.join(__dirname, "../../assets/Carritos.json"),
      productManager
    );
    await cartManager.initialize();
  } catch (error) {
    console.error(
      "Error al inicializar ProductManager o CartManager:",
      error.message
    );
  }
}

main();

module.exports = CartManager;
