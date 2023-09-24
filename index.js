const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);
app.use(cors());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p>`,
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((p) => p.id === id);
  if (!person) {
    res.status(404).end();
  }
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).end();
  }

  if (persons.find((p) => p.name === name)) {
    return res.status(400).json({ error: 'Name must be unique.' });
  }

  const id = Math.max(...persons.map((p) => p.id)) + 1;
  const newPerson = { id, name, number };
  console.log(newPerson);
  persons = [...persons, newPerson];

  res.status(200).json(newPerson).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
