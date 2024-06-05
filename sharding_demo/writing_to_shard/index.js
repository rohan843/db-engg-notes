const app = require("express")();
const { Client } = require("pg");
const { ConsistentHash } = require("consistent-hash");

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

async function connect() {
  await clients[5432].connect();
  await clients[5433].connect();
  await clients[5434].connect();
}

connect();

app.get("/", (req, res) => {});

app.post("/", (req, res) => {});
