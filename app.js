const express = require('express');
const app = express();
const path = require('path');

// Managers
const ProductManager = require('./managers/productManager');
const CartManager = require('./managers/cartManager');

// Routes
const homeRoutes = require('./routes/home');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const realTimeProductsR = require('./routes/realTimeProducts.router');

// Filename
const productsFilename = `${__dirname}/../assets/productos.json`;
const cartsFilename = `${__dirname}/../assets/Carritos.json`;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/realTimeProducts', realTimeProductsR);

const productManager = new ProductManager(productsFilename);
const cartManager = new CartManager(cartsFilename, productManager);

productManager.loadProductsFromFile()
  .then(() => productManager.initialize())
  .then(() => {
    app.use('/api/products', productRoutes);
    app.use('/api/carts', cartRoutes);
    app.use('/api/home', homeRoutes);

    app.get('/', (req, res) => {
      res.render('index', {
        title: 'websockets',
        useWS: true,
      });
    });

    
    const PORT = 8080;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error en la inicialización:', error.message);
  });
