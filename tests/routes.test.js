// tests/routes.test.js
const request = require('supertest');
const app = require('../src/server');
const db = require('../src/database');

describe('Producer Intervals API', () => {
  beforeAll(async () => {
    // Inserir dados de teste
    await new Promise((resolve) => {
      db.serialize(() => {
        db.run('DELETE FROM movies');
        db.run('INSERT INTO movies (year, title, producers, winner) VALUES (2000, "Movie A", "Producer A", 1)');
        db.run('INSERT INTO movies (year, title, producers, winner) VALUES (2005, "Movie B", "Producer A", 1)');
        db.run('INSERT INTO movies (year, title, producers, winner) VALUES (2010, "Movie C", "Producer B", 1)');
        db.run('INSERT INTO movies (year, title, producers, winner) VALUES (2012, "Movie D", "Producer B", 1)');
        resolve();
      });
    });
  });

  it('should return max and min intervals', async () => {
    const res = await request(app).get('/api/producers/intervals');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('max');
    expect(res.body).toHaveProperty('min');
    expect(res.body.max.producer).toBe('Producer A');
    expect(res.body.max.interval).toBe(5);
    expect(res.body.min.producer).toBe('Producer B');
    expect(res.body.min.interval).toBe(2);
  });
});