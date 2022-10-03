import { Router } from "express";
import {
  getRentals,
  postRentals,
  postRentalsReturn,
  deleteRentals,
} from "../controllers/rentalsController.js";

const rentals = Router();

rentals.get("/rentals", getRentals);
rentals.post("/rentals", postRentals);
rentals.post("/rentals/:id/return", postRentalsReturn);
rentals.delete("/rentals/:id", deleteRentals);

export default rentals;
