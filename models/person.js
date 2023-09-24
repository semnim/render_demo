const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (v) => /\d{2,3}-\d*/.test(v),
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, { _id, __v, ...object }) => {
    const returnedObject = { ...object };
    returnedObject.id = _id.toString();
    return returnedObject;
  },
});

module.exports = mongoose.model('Person', personSchema);
