import express from 'express';
import { engine } from 'express-handlebars';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
//fix for __dirname


app.engine('handlebars', engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);



const server = app.listen(8080,()=>console.log('Listening on 8080'));