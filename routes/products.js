const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/productManager');
const path = require('path');

// Ruta al archivo JSON de productos
const productsFilePath = path.join(__dirname, '../../assets/productos.json');

//const filename = path.join(__dirname, '../../assets/productos.json');
const productManager = new ProductManager(productsFilePath);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (_, res) => {
  try {
    const products = await productManager.getProducts();
    console.log('Productos:', products); 
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving products', message: err.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (!product) {
      res.status(404).json({ error: 'Producto inexistente con ID ' + req.params.pid });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto con ID ' + req.params.pid, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    
    // Validar si los campos requeridos están presentes en la solicitud
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock) {
      res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      return;
    }
    newProduct.status = true;

    await productManager.addProduct(newProduct);
    // Redirigir al cliente a la página realTimeProducts después de agregar el producto
    res.redirect('/api/realTimeProducts');
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar producto.', message: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    
    // Validar si los campos requeridos están presentes en la solicitud
    if (Object.keys(updatedFields).length === 0) {
      res.status(400).json({ error: 'Se requieren campos para actualizar el producto.' });
      return;
    }
    if ('quantity' in updatedFields) {
     
      delete updatedFields.quantity;
    }
    await productManager.updateProduct(productId, updatedFields);
    res.status(200).json({ message: 'Producto actualizado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el producto.', message: err.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await productManager.deleteProduct(productId);
    res.status(200).json({ message: 'Producto eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto.', message: err.message });
  }
});

module.exports = router;
