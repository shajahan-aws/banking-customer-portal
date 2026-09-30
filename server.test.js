const request = require('supertest');
const app = require('./server');

describe('Banking Customer Portal API Tests', () => {
  
  // Test 1: Verify Health Endpoint
  test('GET /health should return status UP', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('UP');
  });

  // Test 2: Register a New Customer
  test('POST /customers/register should create a new customer', async () => {
    const newCustomer = {
      name: 'Anjali Verma',
      email: 'anjali@bank.com',
      accountType: 'Current'
    };
    const response = await request(app)
      .post('/customers/register')
      .send(newCustomer);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.data.name).toBe('Anjali Verma');
  });

  // Test 3: Get Customer Details by ID
  test('GET /customers/:id should return correct customer details', async () => {
    const response = await request(app).get('/customers/101');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Rahul Sharma');
  });

});