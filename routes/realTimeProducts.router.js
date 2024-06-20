const { Router } = require('express');
const router = Router();
const ProductManager = require('../managers/productManager');
const path = require('path');
const filename = path.join(__dirname, '../../assets/productos.json');
const productManager = new ProductManager(filename);

router.get('/', async (_, res) => {
    try {
        const products = await productManager.getProducts();

        res.render('realTimeProducts', {
            products: products,
            titlePage: 'Productos',
            h1: 'Productos en tiempo real',
            style: ['style.css'],
            script: ['realTimeProducts.js'],
            useWS: true
        });

        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
router.post('/api/realTimeProducts', async (req, res) => { 
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

router.delete('/:pid', async (req, res) => {
    try {

        const productId = parseInt(req.params.pid);

        await productManager.deleteProduct(productId);

        const products = await productManager.getProducts();

        req.app.get('ws').emit('updateFeed', products);

        res.status(301).redirect('/api/realTimeProducts');
    } catch {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;