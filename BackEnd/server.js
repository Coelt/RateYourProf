const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
let collection;

async function main() {
  try {
    await client.connect();
    const db = client.db('app');
    collection = db.collection('profs');

    app.listen(8080, () => {
      console.log('Server is running on port 8080');
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

main();

app.post('/profs', async (req, res) => {
  try {
    const doc = {
      name: req.body.name,
      rating: req.body.rating
    };
    const result = await collection.insertOne(doc);
    console.log('Professor added successfully');
    console.log(`Inserted _id: ${result.insertedId}`);
    res.status(201).json({ message: 'Professor added successfully', data: result.ops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', async (req, res) => {
  return res.send('Hello World');
});

app.get('/profs', async (req, res) => {
  try {
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
