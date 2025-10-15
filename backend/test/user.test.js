const request = require('supertest');
const express = require('express');

const userRouter = require('../server/Routers/user.js');

const app = express();
app.use(express.json());
app.use(userRouter);

describe('GET /api/user/:id', () => {
    it("devuelve 404 si el usuario no existe", async () => {
        const res = await request(app).get('/api/user/99999');
        expect(res.statusCode).toEqual(404);
        expect(res.text).toBe('Usuario no encontrado');
    });

    it("devuelve estado:200 y un objeto JSON con los datos del usuario", async () => {
        const res = await request(app).get('/api/user/1');
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/json/);
    });
});