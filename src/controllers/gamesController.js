import database from "../database/database.js";
import gameSchema from "../schemas/gameSchema.js";

async function getGames(req, res) {
  const { name } = req.query;

  try {
    if (name) {
      const games = (
        await database.query(
          `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE ('%' || $1 || '%')`,
          [name]
        )
      ).rows;

      return res.send(games);
    }

    const games = (
      await database.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id`
      )
    ).rows;

    res.send(games);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

async function postGames(req, res) {
  const game = req.body;

  const schemaValidation = gameSchema.validate(game, { abortEarly: false });

  if (schemaValidation.error) {
    console.log(game.error.message);
    return res.sendStatus(400);
  }

  try {
    const gameExists = (
      await database.query(`SELECT * FROM games WHERE name = $1`, [game.name])
    ).rows;

    if (gameExists.length > 0) {
      return res.sendStatus(409);
    }

    const category = (
      await database.query("SELECT * FROM categories WHERE id = $1", [
        game.categoryId,
      ])
    ).rows[0];

    if (!category?.id) {
      return res.sendStatus(400);
    }

    database.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
      [
        game.name,
        game.image,
        game.stockTotal,
        game.categoryId,
        game.pricePerDay,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { getGames, postGames };
