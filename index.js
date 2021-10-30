const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2tgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){
  try{
    await client.connect();
    const database = client.db("travel_cove_db");
    const serviceCollection = database.collection("services");

    app.get('/services', async (req, res) =>{
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services);
    });

    app.get('/services/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.json(service);
      console.log(service);
    })
    
  }
  finally{
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Gello World!')
});

app.listen(port, () => {
  console.log(`Running on the port: ${port}`)
});