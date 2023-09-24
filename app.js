const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const personRouter = require('./controllers/persons');
const { errorHandler, endpointNotFound } = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();

mongoose.set('strictQuery', false);
const connectToDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info('Successfully connected to DB.');
  } catch (err) {
    logger.error('Error while connecting to the DB.');
  }
};
connectToDb();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use('/api/persons', personRouter);
app.use(endpointNotFound);
app.use(errorHandler);

module.exports = app;
