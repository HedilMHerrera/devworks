const request = require('supertest');
const app = require('../server/index.js');

describe("GET /", () => {
    it("respuesta esperada: Bienvenido a Pycraft", async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe("Bienvenido a PyCraft");
    });
});