import database from "../database/database.js";

async function getCategories(req, res) {
  const categories = (await database.query("SELECT * FROM categories;")).rows;

  res.send(categories);
}

async function postCategories(req, res) {
  const category = req.body;

  if (!category.name) {
    return res.sendStatus(400);
  }

  try {
    const categories = (
      await database.query(`SELECT * FROM categories WHERE name = $1`, [
        category.name,
      ])
    ).rows;

    if (categories.length > 0) {
      return res.sendStatus(409);
    }

    database.query(`INSERT INTO categories (name) VALUES ($1)`, [
      category.name,
    ]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { getCategories, postCategories };
