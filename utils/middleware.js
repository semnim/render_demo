const endpointNotFound = (req, res) => res.status(404).send('<p>Oops! Page not found.</p>');

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }
  return next(err);
};

module.exports = { endpointNotFound, errorHandler };
