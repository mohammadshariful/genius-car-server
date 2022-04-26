const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSSS}@cluster0.xhzwb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const ProductCollection = client.db("emaJhon").collection("product");
    app.get("/product", async (req, res) => {
      const query = {};
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const cursor = ProductCollection.find(query);

      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send(products);
    });

    app.get("/pageCount", async (req, res) => {
      const count = await ProductCollection.estimatedDocumentCount();
      res.send({ count });
    });
    // use post to get products by ids
    app.post("/productByKeys", async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = ProductCollection.find(query);
      const products = await cursor.toArray();

      res.send(products);
    });
    /*  //use post to get product
    app.post("/productByKeys", async (req, res) => {
      const keys = req.body;
      console.log(keys);
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = ProductCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    }); */
  } finally {
    //  await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ema jhon server is running ");
});

app.listen(port, () => {
  console.log("ema-jhon server is running");
});
