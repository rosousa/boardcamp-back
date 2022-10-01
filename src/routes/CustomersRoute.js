import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  postCustomer,
  putCustomer,
} from "../controllers/customersController.js";

const customers = Router();

customers.get("/customers", getCustomers);
customers.get("/customers/:id", getCustomerById);
customers.post("/customers", postCustomer);
customers.put("/customers/:id", putCustomer);

export default customers;
