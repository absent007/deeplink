const express = require('express');
const { nanoid } = require('nanoid');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// Replace YOUR_DATABASE_URL with your database URL
const dbUrl = 'YOUR_DATABASE_URL';

// Replace YOUR_COLLECTION_NAME with your collection name
const collectionName = 'YOUR_COLLECTION_NAME';

// Set up database connection
const client = new MongoClient(dbUrl, { useNewUrlParser: true });
client.connect(err => {
  if (err) {
    console.log('Failed to connect to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Set up route for shortening URLs
app.post('/shorten', express.json(), async (req, res) => {
  const longUrl = req.body.url;
  const id = nanoid(8);
  
  // Save the long URL and the shortened URL ID to the database
  const db = client.db();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne({ longUrl, shortUrlId: id });
  
  res.json({ id });
});

// Set up route for redirecting shortened URLs
app.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  // Look up the long URL associated with the shortened URL ID in the database
  const db = client.db();
  const collection = db.collection(collectionName);
  const result = await collection.findOne({ shortUrlId: id });
  
  if (result) {
    const longUrl = result.longUrl;
    res.redirect(longUrl);
  } else {
    res.sendStatus(404);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
