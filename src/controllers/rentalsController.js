import database from "../database/database.js";
import rentalSchema from "../schemas/rentalSchema.js";

async function getRentals(req, res) {
  const { customerId } = req.query;
  const { gameId } = req.query;

  try {
    if (customerId) {
      const rentals = (
        await database.query(
          `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) "customer", json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1`,
          [customerId]
        )
      ).rows;
      return res.send(rentals);
    }

    if (gameId) {
      const rentals = (
        await database.query(
          `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) "customer", json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId" = $1`,
          [gameId]
        )
      ).rows;
      return res.send(rentals);
    }

    const rentals = (
      await database.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) "customer", json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id`
      )
    ).rows;
    res.send(rentals);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function postRentals(req, res) {
  let rental = req.body;

  const validSchema = rentalSchema.validate(rental, { abortEarly: false });

  if (validSchema.error) {
    return res.sendStatus(400);
  }

  try {
    const customerExists = (
      await database.query("SELECT * FROM customers WHERE id = $1", [
        rental.customerId,
      ])
    ).rows;

    const gameExists = (
      await database.query("SELECT * FROM games WHERE id = $1", [rental.gameId])
    ).rows[0];

    if (
      customerExists.length === 0 ||
      !gameExists?.id ||
      rental.daysRented <= 0
    ) {
      return res.sendStatus(400);
    }

    const rentals = (
      await database.query(
        'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" is NULL;',
        [rental.gameId]
      )
    ).rows;

    if (rentals.length >= gameExists.stockTotal) {
      return res.sendStatus(400);
    }

    rental = {
      ...rental,
      rentDate: new Date().toISOString().slice(0, 10),
      originalPrice: rental.daysRented * gameExists.pricePerDay,
      returnDate: null,
      delayFee: null,
    };

    database.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [
        rental.customerId,
        rental.gameId,
        rental.rentDate,
        rental.daysRented,
        rental.returnDate,
        rental.originalPrice,
        rental.delayFee,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function postRentalsReturn(req, res) {
  const { id } = req.params;
  const date = new Date();

  try {
    let daysFee;

    const rental = (
      await database.query("SELECT * FROM rentals WHERE id = $1", [id])
    ).rows[0];

    if (!rental?.id || rental.returnDate !== null) {
      return res.sendStatus(404);
    }

    const daysDifference = Math.ceil(
      (date.getTime() - new Date(rental.rentDate).getTime()) /
        (1000 * 3600 * 24)
    );

    if (daysDifference > rental.daysRented) {
      daysFee =
        (daysDifference - rental.daysRented) *
        (rental.originalPrice / rental.daysRented);
      console.log(daysFee);
      console.log(daysDifference);
    }

    await database.query(
      'UPDATE rentals SET "delayFee" = $1, "returnDate" = $2 WHERE id = $3',
      [daysFee, date.toISOString(), rental.id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function deleteRentals(req, res) {
  const { id } = req.params;

  try {
    const rental = (
      await database.query("SELECT * FROM rentals WHERE id = $1", [id])
    ).rows[0];

    if (!rental?.id) {
      return res.sendStatus(404);
    }

    if (rental.returnDate === null) {
      return res.sendStatus(400);
    }

    await database.query("DELETE FROM rentals WHERE id = $1", [id]);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { getRentals, postRentals, postRentalsReturn, deleteRentals };
