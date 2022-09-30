import { Router } from "express";
import { getGames } from "../controllers/gamesController.js";

const games = Router();

games.get("/games", getGames);

export default games;
