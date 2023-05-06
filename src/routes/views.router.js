import express from "express";
import ProductManager from '../ProductManager.js';
import __dirname from '../utils.js';

const router = express.Router();
const productsManager = new ProductManager(`${__dirname}/products.json`);

router.get('/', async (req, res) => {
    try {
        let products = await productsManager.getProducts();
        res.render('home', { products, style: 'index.css'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts', {style: 'index.css'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});
    
export default router;