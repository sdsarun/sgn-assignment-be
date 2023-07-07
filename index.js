import { Country } from "./model/Country.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import os from "os";
dotenv.config();

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME } = process.env;
const PORT = process.env.PORT || 3001;

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

server.listen(PORT || 3001, async () => {
  console.log(`Server listen on port ${PORT}`);
  try {
    await mongoose.connect(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@jason.gyhm9f9.mongodb.net/?retryWrites=true&w=majority`, {
      dbName: MONGODB_DBNAME
    });
    console.log("Connected mongodb successfully.");
  } catch (err) {
    console.log(err);
  }
});