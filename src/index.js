const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = require('./utils/swaggerOptions')

const app = express();
const PORT = 3000;

app.use(express.json());

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.use('/usuarios', require('./routes/usuariosRoute'));
app.use('/pedidos', require('./routes/pedidosRoute'));
app.use('/productos', require('./routes/productosRoute'));
app.use('/mediosdepago', require('./routes/mediosPagoRoute'));

app.use('/:id/', (req, res) => { res.status(400).send('No se pudo procesar la operación.')});
app.use('/', (req, res) => { res.status(400).send('No se pudo procesar la operación.')});

app.listen(PORT, () => { console.log(`Escuchando desde el puerto ${PORT}`) });
