const express = require('express');
const { config } = require('../../config');
const ProductsService = require('../../services/products');

const router = express.Router();
const productService = new ProductsService()

const cacheResponse = require("../../utils/cacheResponse");
const { FIVE_MINUTES_IN_SECONDS } = require(
  "../../utils/time"
);

router.get('/', async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;
    try {
        const products = await productService.getProducts({ tags });
        res.render("products", { products, dev: config.dev });
    } catch (err) {
        next(err);
    }
})

module.exports = router;