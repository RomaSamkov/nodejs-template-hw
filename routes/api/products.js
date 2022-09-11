const express = require("express");
const { NotFound } = require("http-errors");
const Joi = require("joi");

const productsSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0.01).required(),
  location: Joi.string().required(),
});

const productsOperations = require("../../models/products");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await productsOperations.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productsOperations.getById(id);
    if (!result) {
      throw new NotFound(`Product with id=${id} not found`);
    }
    res.json({
      status: "success",
      code: 200,
      data: { result },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = productsSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const result = await productsOperations.add(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = productsSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { id } = req.params;
    const result = await productsOperations.updateById(id, req.body);
    if (!result) {
      throw new NotFound(`Product with id=${id} not found`);
    }
    res.json({
      status: "success",
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productsOperations.removeById(id);
    if (!result) {
      throw new NotFound(`Product with id=${id} not found`);
    }
    res.json({
      status: "success",
      code: 200,
      message: "product deleted",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
