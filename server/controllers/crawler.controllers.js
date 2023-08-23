const axios = require('axios');
const cheerio = require('cheerio');
const News = require('../model/crawler.model');
require("dotenv").config();

const crawlAndStoreData = async (req, res) => {
  try {
    const response = await axios.get(process.env.CRAWLING_WEBSITE_URL);
    const $ = cheerio.load(response.data);
    const newsData = [];
    $('.articles').each((index, element) => {
      const article = $(element);
      const imageSrcWithResize = article.find('.snaps img').attr('src');
      const imageSrc = imageSrcWithResize.split('?')[0];
      const title = article.find('.title a').text();
      const date = article.find('.date').text();
      const content = article.find('.img-context p').text();

    //   console.log(`Title: ${title}`);
    //   console.log(`Date: ${date}`);
    //   console.log(`Content: ${content}`);
    //   console.log(`Image Source: ${imageSrc}`);

      newsData.push({ title, date, content, imageSrc });
    });

    
    await News.insertMany(newsData);
    const savedData = await News.find({});
    if (savedData.length > 0) {
      res.json('Data has been crawled and stored in MongoDB.');
      console.log('Data has been crawled and stored in MongoDB.');
    } else {
      res.status(500).json({ message: 'Data could not be saved in MongoDB' });
      console.error('Data could not be saved in MongoDB.');
    }
  } catch (error) {
    console.error('Error crawling and storing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCrawledNews = async(req,res)=>{
    try {
        const news = await News.find().sort({ date: -1 }); 
        res.json(news);
      } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

module.exports = {
  crawlAndStoreData,
  getCrawledNews
};
