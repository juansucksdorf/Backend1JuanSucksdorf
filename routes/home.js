const { Router } = require('express');
const router = Router();
const path = require('path');
const ProductManager = require('../managers/productManager');
const productsFilePath = path.join(__dirname, '../../assets/productos.json');

const productManager = new ProductManager(productsFilePath);

router.get('/', async (_, res) => {
    try {
        const products = await productManager.getProducts();

        const productsData = products.map(product => ({
            title: product.title,
            thumbnail: product.thumbnail,
            description: product.description,
            price: product.price,
            stock: product.stock,
            code: product.code
        }));

        res.render('home', {
            products: productsData,
            titlePage: 'Productos',
            h1: 'Tienda',
            style: ['style.css'],
            script: ['home.js']
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
module.exports = router;