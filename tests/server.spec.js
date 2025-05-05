const request = require('supertest');
const server = require('../index');

describe('Cafetería Nanacao - Pruebas', () => {
  // Test 1: GET /cafes
  it('GET /cafes retorna status 200 y array con mínimo 1 objeto', async () => {
    const response = await request(server).get('/cafes');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test 2: DELETE /cafes/:id
  it('DELETE /cafes/:id retorna 404 con ID inexistente (incluyendo token)', async () => {
    const idInexistente = 999;
    const response = await request(server)
      .delete(`/cafes/${idInexistente}`)
      .set('Authorization', 'token-de-prueba')
      .send();
    expect(response.statusCode).toBe(404);
  });

  // Test 3: POST /cafes 
  it('POST /cafes agrega café y retorna 201', async () => {
    const nuevoCafe = { id: 5, nombre: "Mocaccino" }; 
    const response = await request(server)
      .post('/cafes')
      .send(nuevoCafe);
    expect(response.statusCode).toBe(201);
    // Verificación adicional: que el café fue agregado
    const getResponse = await request(server).get('/cafes');
    expect(getResponse.body).toContainEqual(nuevoCafe);
  });

  // Test 4: PUT /cafes
  it('PUT /cafes/:id retorna 400 si ID en parámetro ≠ ID en payload', async () => {
    const cafeActualizado = { id: 1, nombre: "Latte Mejorado" };
    const idDiferente = 999; 
    const response = await request(server)
      .put(`/cafes/${idDiferente}`)
      .send(cafeActualizado);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/no coincide/);
  });

  // Test DELETE sin token
  it('DELETE /cafes/:id retorna 400 sin token', async () => {
    const response = await request(server)
      .delete('/cafes/1')
      .send();
    expect(response.statusCode).toBe(400);
  });
});