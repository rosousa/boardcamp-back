import database from "../database/database.js";

async function getCategories(req, res) {
  const categories = (await database.query("SELECT * FROM categories;")).rows;

  res.send(categories);
}

export { getCategories };
