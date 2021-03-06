const express = require("express");
const path = require("path");
const boom = require('@hapi/boom');
const debug = require("debug")("app:server");
const helmet = require('helmet');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');
const authApiRouter = require('./routes/api/auth');
const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi')
const { config } = require('./config');
const {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler
} = require("./utils/middlewares/errorsHandlers");

// app initialization
const app = express();

//middlewares
app.use(helmet());
app.use(express.json()); // Para datos tipo application/json

// static files
app.use("/static", express.static(path.join(__dirname, "public")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// routes
app.use("/products", productsRouter);
productsApiRouter(app);
app.use("/api/auth", authApiRouter);

// redirect to products
app.get('/', (req, res) => {
  res.redirect('/products')
});

app.use((req, res, next) => {
  if (isRequestAjaxOrApi(req)) {
    const {
      output: { statusCode, payload }
    } = boom.notFound();

    res.status(statusCode).json(payload);
  }

  res.status(404).render("404");
});

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// start listening HTTPS
 const server = app.listen(config.port, () => {
   debug(`Listening http://localhost:${server.address().port}`); 
  }
);

module.exports = server;