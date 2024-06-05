const app = require("express")();
const { Client } = require("pg");

const clients = {
  5432: new Client({
    host: "172.17.0.2",
    port: "5432",
    user: "postgres",
    password: "password",
    database: "postgres",
  }),
  5433: new Client({
    host: "172.17.0.3",
    port: "5433",
    user: "postgres",
    password: "password",
    database: "postgres",
  }),
  5434: new Client({
    host: "172.17.0.4",
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
