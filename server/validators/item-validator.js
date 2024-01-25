const { body } = require("express-validator");

const createItemValidator = [
  body("name").notEmpty().withMessage("Name must be provided"),
  body("collectionId").notEmpty().withMessage("Collection id must be provided"),
];

module.exports = { createItemValidator: createItemValidator };
