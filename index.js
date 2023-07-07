import { Country } from "./model/Country.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const { PORT, HOSTNAME, MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME } = process.env;

const server = express();
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("<h1>If you can see this that mean server it okay? (sdsarun)</h1><p>GET - <a href='/api/country'>" + "/api/country" + "</a></p>");
})

server.get("/api/country", async (req, res) => {
  const countries = await Country.find({});
  res.send(countries);
})

server.listen(PORT, HOSTNAME, async () => {
  console.log(`Server listen on http://${HOSTNAME}:${PORT}`);
  try {
    await mongoose.connect(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@jason.gyhm9f9.mongodb.net/?retryWrites=true&w=majority`, {
      dbName: MONGODB_DBNAME
    });
    console.log("Connected mongodb successfully.");
  } catch (err) {
    console.log(err);
  }
});