const express = require('express');
const app = express();

app.use(express.json());

const APP_PORT = process.env.APP_PORT || 8080;

let customers = [
  { id: 101, name: 'Rahul Sharma', email: 'rahul@bank.com', accountType: 'Savings' }
];

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Banking Customer Portal' });
});

// GET - View all customers
app.get('/customers', (req, res) => {
  res.json({ count: customers.length, data: customers });
});

// GET - View customer details by ID
app.get('/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const customer = customers.find(c => c.id === id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// POST - Register a new customer
app.post('/customers/register', (req, res) => {
  const { name, email, accountType } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newCustomer = {
    id: customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 101,
    name,
    email,
    accountType: accountType || 'Savings'
  };

  customers.push(newCustomer);
  res.status(201).json({ message: 'Customer registered successfully', data: newCustomer });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(APP_PORT, () => {
    console.log(`Banking Portal running on port ${APP_PORT}`);
  });
}

module.exports = app;