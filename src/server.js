import express from "express";
import cors from "cors";
import categoriesRoutes from "./routes/categoriesRoute.js";
import gamesRoutes from "./routes/gamesRoute.js";
import customersRoutes from "./routes/CustomersRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(categoriesRoutes);
app.use(gamesRoutes);
app.use(customersRoutes);

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

app.listen(4000, () => console.log("Listening on port 4000"));
