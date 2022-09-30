import { Router } from "express";
import { getCategories } from "../controllers/categoriesController.js";

const categories = Router();

categories.get("/categories", getCategories);

export default categories;
