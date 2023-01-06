import express from "express";
import { pool } from "./db";
import { messageBroker } from "./message-broker/MessageBroker";
import { wsApp } from "./ws";

const app = express();

app.get("/reservations", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM reservations");
    const reservations = result.rows;
    client.release();
    res.json(reservations);
    messageBroker.send("get-reservations", "test");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/resources", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM resources");
    const resources = result.rows;
    client.release();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/customers", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM customers");
    const customers = result.rows;
    client.release();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/reservations", async (req, res) => {
  try {
    const { startTime, endTime, rate, resourceId, customerId } = req.body;
    const client = await pool.connect();

    // Check if the resource is available for the requested time period
    const availabilityResult = await client.query(
      "SELECT * FROM reservations WHERE resource_id = $1 AND start_time <= $2 AND end_time >= $3",
      [resourceId, endTime, startTime]
    );
    const reservations = availabilityResult.rows;
    if (reservations.length > 0) {
      // The resource is not available for the requested time period
      client.release();
      return res.status(400).send("The resource is not available for the requested time period.");
    }

    // Create the reservation
    const result = await client.query(
      "INSERT INTO reservations (start_time, end_time, rate, resource_id, customer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [startTime, endTime, rate, resourceId, customerId]
    );
    const reservation = result.rows[0];
    client.release();
    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

pool.connect();

const httpPort = 3000;
app.listen(httpPort, () => {
  console.log(`Server listening at http://localhost:${httpPort}`);
});

const wsPort = 9001;
wsApp.listen(wsPort, (listenSocket) => {
  if (listenSocket) {
    console.log(`Websocket server listening to port ${wsPort}`);
  }
});
