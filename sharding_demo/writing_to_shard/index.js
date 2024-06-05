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
    port: "5432",
    user: "postgres",
    password: "password",
    database: "postgres",
  }),
  5434: new Client({
    host: "172.17.0.4",
    port: "5432",
    user: "postgres",
    password: "password",
    database: "postgres",
  }),
};

app.get("/", (req, res) => {});

app.post("/", (req, res) => {});
