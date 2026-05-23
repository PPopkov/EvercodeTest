const express = require('express');
const app = express();
const statusRoute = require('./routes/status')
const authMiddleware =require('./middleware/auth')

app.use(express.json());
app.use(authMiddleware)
app.use('/status', statusRoute)


module.exports = app;