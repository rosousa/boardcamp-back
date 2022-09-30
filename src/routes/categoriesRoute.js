import { Router } from "express";
import {
  getCategories,
  postCategories,
} from "../controllers/categoriesController.js";

const categories = Router();

categories.get("/categories", getCategories);

categories.post("/categories", postCategories);

export default categories;
