import database from "../database/database.js";
import customerSchema from "../schemas/customerSchema.js";

async function getCustomers(req, res) {
  const param = req.query.cpf;

  try {
    if (param) {
      const customers = (
        await database.query(
          `SELECT * FROM customers WHERE cpf LIKE ($1 || '%');`,
          [param]
        )
      ).rows;

      return res.send(customers);
    }

    const customers = (await database.query(`SELECT * FROM customers;`)).rows;

    res.send(customers);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = (
      await database.query("SELECT * FROM customers WHERE id = $1", [id])
    ).rows;

    if (customer.length === 0) {
      return res.sendStatus(404);
    }

    res.send(customer);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function postCustomer(req, res) {
  const customer = req.body;
  const validSchema = customerSchema.validate(customer, { abortEarly: false });

  if (validSchema.error) {
    console.log(validSchema.error.message);
    return res.sendStatus(400);
  }

  try {
    const customerExists = (
      await database.query("SELECT * FROM customers WHERE cpf = $1;", [
        customer.cpf,
      ])
    ).rows;

    if (customerExists.length > 0) {
      return res.sendStatus(409);
    }

    database.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
      [customer.name, customer.phone, customer.cpf, customer.birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function putCustomer(req, res) {
  const { id } = req.params;
  const customer = req.body;

  const validSchema = customerSchema.validate(customer, { abortEarly: false });

  if (validSchema.error) {
    console.log(validSchema.error.message);
    return res.sendStatus(400);
  }

  try {
    const customerExists = (
      await database.query("SELECT * FROM customers WHERE id = $1;", [id])
    ).rows;

    if (customerExists.length === 0) {
      return res.sendStatus(404);
    }

    const cpfExists = (
      await database.query("SELECT * FROM customers WHERE cpf = $1;", [
        customer.cpf,
      ])
    ).rows;

    if (cpfExists.length > 0) {
      return res.sendStatus(409);
    }

    database.query(
      `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;`,
      [customer.name, customer.phone, customer.cpf, customer.birthday, id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { getCustomers, getCustomerById, postCustomer, putCustomer };
