const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDb = require("./config/db");
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
connectDb();



app.get("/", (req, res) => {
  res.json(
    "Hi there from Amaan Haider,  This is a BACKEND SERVER OF NEWS-CRAWLER 🫡✅✨"
  );
});

app.listen(PORT, () => {
  console.log(`Listenig on ${PORT}✨✅`);
});
