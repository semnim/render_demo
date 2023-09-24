const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');
require('dotenv').config();
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);
app.use(cors());

app.get('/info', async (req, res) => {
  const persons = await Person.find({});
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p>`,
  );
});

app.get('/api/persons', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).end();
    }
    res.json(person);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
  } catch (err) {
    next(err);
  }

  res.status(204).end();
});

app.put('/api/persons/:id', async (req, res, next) => {
  const { name, number } = req.body;
  try {
    const result = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' },
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});
app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).end();
  }
  const personExists = await Person.findOne({ name: name });
  if (personExists) {
    return res.status(400).json({ error: 'Name must be unique.' });
  }

  const newPerson = new Person({ name, number });

  try {
    const savedPerson = await newPerson.save();
    res.status(200).json(savedPerson).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

const endpointNotFound = (req, res) => {
  return res.status(404).send('<p>Oops! Page not found.</p>');
};
app.use(endpointNotFound);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
