import express from "express";

const app = express();

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

app.listen(4000, () => console.log("Listening on port 4000"));
