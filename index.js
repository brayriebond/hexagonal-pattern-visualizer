const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Webhook secret (set this as an environment variable in Glitch)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

// Regular route for serving the visualization
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.get('/api/data', (req, res) => {
  // Sample data for visualization
  const data = [
    { id: 1, name: 'A', value: 20 },
    { id: 2, name: 'B', value: 40 },
    { id: 3, name: 'C', value: 30 },
    { id: 4, name: 'D', value: 60 },
    { id: 5, name: 'E', value: 10 },
  ];
  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
