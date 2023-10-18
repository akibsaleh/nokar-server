const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middlewares

app.use(cors());
app.use(express.json());

// Connection to mongo

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.hfh6rjb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db('nokar-shop').collection('products');
    const brandsCollection = client.db('nokar-shop').collection('brands');

    app.get('/products', async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.send(products);
    });

    app.get('/brands', async (req, res) => {
      const brands = await brandsCollection.find().toArray();
      res.send(brands);
    });

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.post('/brands', async (req, res) => {
      const newBrand = req.body;
      const result = await brandsCollection.insertOne(newBrand);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Nokar Server is Running');
});

app.listen(port, () => {
  console.log('Nokar Server is running');
});
