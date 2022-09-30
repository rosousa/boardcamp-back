import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().empty(1).required(),
  image: joi.string().min(1).required(),
  stockTotal: joi.number().integer().greater(0).required(),
  categoryId: joi.number().integer().required(),
  pricePerDay: joi.number().greater(0).required(),
});

export default gameSchema;
