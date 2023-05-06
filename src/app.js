import express from 'express';
import {Server} from "socket.io";
import {engine} from 'express-handlebars';
import ProductManager from './ProductManager.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
//fix for __dirname
const productsManager = new ProductManager(`${__dirname}/products.json`);

app.engine('handlebars', engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);

const httpserver = app.listen(8080,()=>console.log("Listening"))
const io = new Server(httpserver);

io.on('connection',async(socket)=>{
    console.log('New connection.')
    const products = await productsManager.getProducts()
    socket.emit('data_update',{products})
    socket.on('delete_product',async(data)=>{
        await productsManager.deleteProduct(parseInt(data))
        const updateProducts=await productsManager.getProducts()
        console.log(updateProducts)
        io.sockets.emit('update_from_server',updateProducts)
    })
  
    socket.on('new_product_to_server',async(data)=>{
        const newproduct=await productsManager.addProduct(data)
        console.log(newproduct)
        const newproducts=await productsManager.getProducts()
        io.sockets.emit('new_products_from_server',newproducts)
    })
})

