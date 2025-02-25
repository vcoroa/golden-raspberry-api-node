// src/loadData.js
const fs = require('fs');
const { parse } = require('csv-parse');
const db = require('./database');

function loadData() {
  return new Promise((resolve, reject) => {
    const movies = [];
    fs.createReadStream('./movies.csv')
      .pipe(parse({
        columns: true,      // Trata a primeira linha como cabeçalho
        delimiter: ';',     // Define o delimitador como ponto e vírgula
        trim: true,         // Remove espaços em branco
        skip_empty_lines: true // Ignora linhas vazias
      }))
      .on('data', (row) => {
        movies.push({
          year: parseInt(row.year),
          title: row.title,
          studios: row.studios,
          producers: row.producers,
          winner: row.winner === 'yes' || row.winner === 'true' // Converte "yes" ou "true" para booleano
        });
      })
      .on('end', () => {
        db.serialize(() => {
          const stmt = db.prepare('INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)');
          movies.forEach(movie => {
            stmt.run(movie.year, movie.title, movie.studios, movie.producers, movie.winner ? 1 : 0);
          });
          stmt.finalize();
          console.log('CSV data loaded into database');
          resolve();
        });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error.message);
        reject(error);
      });
  });
}

module.exports = loadData;