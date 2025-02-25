// src/routes.js
const express = require('express');
const db = require('./database');

const router = express.Router();

router.get('/producers/intervals', (req, res) => {
  db.all('SELECT year, producers FROM movies WHERE winner = 1 ORDER BY year', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const producerWins = new Map();

    // Agrupar vitórias por produtor
    rows.forEach(row => {
      const producers = row.producers.split(/,| and /).map(p => p.trim());
      producers.forEach(producer => {
        if (!producerWins.has(producer)) producerWins.set(producer, []);
        producerWins.get(producer).push(row.year);
      });
    });

    let maxInterval = { producer: '', interval: -1, previousWin: 0, followingWin: 0 };
    let minInterval = { producer: '', interval: Infinity, previousWin: 0, followingWin: 0 };

    producerWins.forEach((years, producer) => {
      if (years.length < 2) return; // Só interessa quem ganhou mais de uma vez
      years.sort((a, b) => a - b);

      for (let i = 1; i < years.length; i++) {
        const interval = years[i] - years[i - 1];
        if (interval > maxInterval.interval) {
          maxInterval = { producer, interval, previousWin: years[i - 1], followingWin: years[i] };
        }
        if (interval < minInterval.interval) {
          minInterval = { producer, interval, previousWin: years[i - 1], followingWin: years[i] };
        }
      }
    });

    res.json({
      max: maxInterval,
      min: minInterval
    });
  });
});

module.exports = router;