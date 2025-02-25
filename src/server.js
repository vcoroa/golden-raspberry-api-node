// src/server.js
const express = require('express');
const loadData = require('./loadData');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

async function startServer() {
  try {
    await loadData();
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();

module.exports = app; // Para testes