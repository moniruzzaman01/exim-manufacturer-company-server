const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
//-------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q9lb9zo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const userCollection = client.db("exim").collection("users");

    app.put("/users", async (req, res) => {
      const email = req.query.email;
      const filter = { email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: { email },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ result, accessToken: token });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//-------------------------------------
app.get("/", (req, res) => {
  res.send("Manufacturing is going on!");
});
app.listen(port, () => {
  console.log("listening from", port);
});
