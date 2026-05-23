const express = require('express');
const app = express();
const statusRoute = require('./routes/status');
const currency = require('./routes/currency');
const authMiddleware =require('./middleware/auth');

app.use(express.json());
app.use(authMiddleware);
app.use('/currency', currency);
app.use('/status', statusRoute);


module.exports = app;