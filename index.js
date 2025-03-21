const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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