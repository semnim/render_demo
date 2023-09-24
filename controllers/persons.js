const personRouter = require('express').Router();
const Person = require('../models/person');

personRouter.get('/info', async (req, res) => {
  const persons = await Person.find({});
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

personRouter.get('/', async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

personRouter.get('/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).end();
    }
    return res.json(person);
  } catch (err) {
    return next(err);
  }
});

personRouter.delete('/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
  } catch (err) {
    next(err);
  }

  res.status(204).end();
});

personRouter.put('/:id', async (req, res, next) => {
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
personRouter.post('/', async (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).end();
  }
  const personExists = await Person.findOne({ name });
  if (personExists) {
    return res.status(400).json({ error: 'Name must be unique.' });
  }

  const newPerson = new Person({ name, number });

  try {
    const savedPerson = await newPerson.save();
    return res.status(200).json(savedPerson).end();
  } catch (err) {
    return next(err);
  }
});

module.exports = personRouter;
