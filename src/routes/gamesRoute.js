import { Router } from "express";
import { getGames, postGames } from "../controllers/gamesController.js";

const games = Router();

games.get("/games", getGames);

games.post("/games", postGames);

export default games;
