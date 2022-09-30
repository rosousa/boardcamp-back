import database from "../database/database.js";

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

export { getGames };
