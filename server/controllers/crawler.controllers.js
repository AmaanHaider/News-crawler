const axios = require('axios');
const cheerio = require('cheerio');
const News = require('../model/crawler.model');
const FullArticle = require('../model/fullArticle.model'); 
require("dotenv").config();

const crawlAndStoreData = async (req, res) => {
    try {
      let currentPage = 1;
  
        while (true) {
          const response = await axios.get(`${process.env.CRAWLING_WEBSITE_URL}/page/${currentPage}/`);
          const $ = cheerio.load(response.data);
          const newsData = [];
    
          $('.articles').each(async (index, element) => {
            const article = $(element);
            const imageSrcWithResize = article.find('.snaps img').attr('src');
            const imageSrc = imageSrcWithResize ? imageSrcWithResize.split('?')[0] : null;
            const title = article.find('.title a').text();
            const date = article.find('.date').text();
            const content = article.find('.img-context p').text();
            const articleLink = article.find('.snaps a').attr('href');
    
            try {
              const fullArticleResponse = await axios.get(articleLink);
              const $fullArticle = cheerio.load(fullArticleResponse.data);
              const headline = $fullArticle('.native_story_title').text();
              const description = $fullArticle('.synopsis').text(); 
              const authorname = $fullArticle('.bulletProj').text(); 
              const articleImageSrcWithResize = $fullArticle('.custom-caption img').attr('src');
              const articleImageSrc = articleImageSrcWithResize ? articleImageSrcWithResize.split('?')[0] : null;    
              const articleContent = $fullArticle('#pcl-full-content').text();

              const newsArticle = new News({
                title,
                date,
                content,
                imageSrc,
              });
    
              const fullArticle = new FullArticle({
                headline,
                description,
                authorname,
                articleImageSrc,
                articleContent,
                newsArticle: newsArticle._id, 
              });
              await newsArticle.save();
              await fullArticle.save();
    
              // Push the newsData after saving newsArticle
              newsData.push({ title, date, content, imageSrc });
            } catch (error) {
              console.error('Error crawling and storing full article data:', error);
            }
          });
    
          console.log(`Crawled and stored data from page ${currentPage}`);
    
          const nextPageLink = $('.ie-pagination a.next').attr('href');
          if (!nextPageLink){
            break;
          }
          currentPage++;
          await new Promise(resolve => setTimeout(resolve, 2000));
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

const getFullArticleByNewsId = async (req, res) => {
  const newsId = req.params.id;
  // console.log(newsId);

  try {
    const fullArticle = await FullArticle.findOne({ newsArticle: newsId })
    if (!fullArticle) {
      return res.status(404).json({ message: 'Full article not found' });
    }
    res.status(200).json(fullArticle);
  } catch (error) {
    console.error('Error fetching full article:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  crawlAndStoreData,
  getCrawledNews,
  getFullArticleByNewsId
};
