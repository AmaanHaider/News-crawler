const axios = require('axios');
const cheerio = require('cheerio');
const News = require('../model/crawler.model');
require("dotenv").config();

const crawlAndStoreData = async (req, res) => {
  try {
    let currentPage = 1;
    while (true) {
      const response = await axios.get(`${process.env.CRAWLING_WEBSITE_URL}/page/${currentPage}/`);
      const $ = cheerio.load(response.data);
      const newsData = [];
      $('.articles').each((index, element) => {
      const article = $(element);
      const imageSrcWithResize = article.find('.snaps img').attr('src');
      const imageSrc = imageSrcWithResize ? imageSrcWithResize.split('?')[0] : null;
      const title = article.find('.title a').text();
      const date = article.find('.date').text();
      const content = article.find('.img-context p').text();
      newsData.push({ title, date, content, imageSrc });
    });
      await News.insertMany(newsData);
    //   console.log(`Crawled and stored data from page ${currentPage}`);
      const nextPageLink = $('.ie-pagination a.next').attr('href');
      if (!nextPageLink) {
        break;
     }
      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    res.json('Data has been crawled and stored in MongoDB.');
    console.log('All pages have been crawled and data stored in MongoDB.');
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
