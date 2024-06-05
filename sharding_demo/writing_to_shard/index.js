/**
 * This JS code is a demo of how sharding can be used to create a URL shortener app. This is not
 * meant to be executed, but it serves as a reference when read along with the README notes.
 */

const app = require("express")();
const { Client } = require("pg");
const ConsistentHash = require("consistent-hash");
const crypto = require("crypto");

// Creates a hash ring with 3 nodes
const hr = new ConsistentHash();
hr.add(5432);
hr.add(5433);
hr.add(5434);

const clients = {
  5432: new Client({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "password",
    database: "postgres",
  }),
  5433: new Client({
    host: "localhost",
    port: "5433",
    user: "postgres",
    password: "password",
    database: "postgres",
  }),
  5434: new Client({
    host: "localhost",
    port: "5434",
    user: "postgres",
    password: "password",
    database: "postgres",
  }),
};

// Connecting to shards.
async function connect() {
  await clients[5432].connect();
  await clients[5433].connect();
  await clients[5434].connect();
}
connect();

// Reading from a shard.
app.get("/", (req, res) => {});

// Writing to a shard.
app.post("/", (req, res) => {
  const url = req.query.url; // The URL to be shortened.
  const hash = crypto.createHash("sha256").update(url).digest("base64"); // get the hash of the URL.
  const urlID = hash.substring(0, 5);
  res.send({
    urlID,
  });
});

app.listen(8081, () => {
  console.log("Server started on port 8081.");
});
