const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: String,
  date: String,
  content: String,
  imageSrc: String,
});


module.exports = mongoose.model('News', newsSchema);
