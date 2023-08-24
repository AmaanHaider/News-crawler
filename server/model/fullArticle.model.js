const mongoose = require('mongoose');

const fullArticleSchema = new mongoose.Schema({
  headline: String,
  description : String,
  authorname : String,
  articleImageSrc:String,
  articleContent:String,
  newsArticle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News', // Reference to the News model
  },
});

const FullArticle = mongoose.model('FullArticle', fullArticleSchema);

module.exports = FullArticle;


