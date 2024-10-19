const express = require('express');
const cors = require('cors');
const bibleRoutes = require('./routes/bibleRoutes');
const serverless = require('serverless-http');


const app = express();
//const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
//app.use('/api', bibleRoutes);
app.use('/.netlify/functions/api/bible', bibleRoutes);

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

module.exports.handler = serverless(app);
