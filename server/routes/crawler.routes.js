// routes/api.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/crawler.controllers');

router.get('/crawl', newsController.crawlAndStoreData);

router.get('/news', newsController.getCrawledNews);
router.get('/newsarticle/:id', newsController.getFullArticleByNewsId);



module.exports = router;
