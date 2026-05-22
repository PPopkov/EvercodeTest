const express = require('express');
const app = express();
const statusRoute = require('./routes/status')

app.use(express.json());
app.use('/status', statusRoute)


module.exports = app;