const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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
    // await client.connect();
    const productsCollection = client.db('nokar-shop').collection('products');
    const brandsCollection = client.db('nokar-shop').collection('brands');
    const firebaseCollection = client.db('nokar-shop').collection('firebase_auth');

    app.get('/products', async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.send(products);
    });

    app.get('/brands', async (req, res) => {
      const brands = await brandsCollection.find().toArray();
      res.send(brands);
    });

    app.get('/brands-name', async (req, res) => {
      const query = {};
      const options = {
        projection: { _id: 1, name: 1 },
      };
      const brandNames = await brandsCollection.find(query, options).toArray();
      res.send(brandNames);
    });

    app.get('/brands/:brand_name', async (req, res) => {
      const brandName = req.params.brand_name.toLowerCase();
      const query = { name: brandName };
      const cursor = brandsCollection.find(query);
      const brand = await cursor.toArray();
      res.send(brand);
    });

    app.get('/products/:brand_name', async (req, res) => {
      const brandName = req.params.brand_name.toLowerCase();
      const query = { brand: brandName };
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    app.get('/brands-thumb', async (req, res) => {
      const query = {};
      const options = {
        projection: { _id: 1, name: 1, thumb: 1 },
      };
      const brandThumbs = await brandsCollection.find(query, options).toArray();
      res.send(brandThumbs);
    });

    app.get('/firebase', async (req, res) => {
      const firebaseAuth = await firebaseCollection.find().toArray();
      res.send(firebaseAuth);
    });

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
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
