const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Add JSON body parser for webhook payloads
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Webhook secret (set this as an environment variable in Glitch)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

// GitHub webhook endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const event = req.headers['x-github-event'];
  const id = req.headers['x-github-delivery'];
  const payload = req.body;

  // Verify webhook signature
  if (!signature) {
    return res.status(401).send('No signature provided');
  }

  // Calculate expected signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const calculatedSignature = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');
  
  // Compare signatures
  if (signature !== calculatedSignature) {
    return res.status(401).send('Invalid signature');
  }

  // Process only push events
  if (event === 'push') {
    console.log(`Received push event from GitHub: ${id}`);
    
    // Execute git pull to update the project
    exec('git pull origin main', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error pulling from GitHub: ${error}`);
        return res.status(500).send('Error updating from GitHub');
      }
      
      console.log(`Git pull output: ${stdout}`);
      
      // Restart the application (on Glitch, this is the equivalent of clicking "refresh")
      exec('refresh', (refreshError) => {
        if (refreshError) {
          console.log('Could not auto-refresh, may need manual restart');
        } else {
          console.log('Application refreshed successfully');
        }
        
        return res.status(200).send('Project updated and restarted');
      });
    });
  } else {
    // Acknowledge other events
    return res.status(200).send('Event received but no action taken');
  }
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