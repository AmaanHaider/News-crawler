import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pagination, Spinner } from "react-bootstrap";
import { motion } from "framer-motion"; 

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 30;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/news`)
      .then((response) => {
        setNews(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });
  }, []);

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  const totalPages = Math.ceil(news.length / newsPerPage);

  // Change page
  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
    >
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading news...</p>
          <p>Stay tuned for the latest updates!</p>
        </div>
      ) : (
        <>
          <motion.div
            className="row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {currentNews.map((article) => (
              <motion.div
                key={article._id}
                className="col-md-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="card"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={article.imageSrc}
                    className="card-img-top"
                    alt={article.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text">{article.content}</p>
                    <Link
                      to={`/news/${article._id}`}
                      className="btn btn-primary"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <Pagination className="justify-content-center">
            <Pagination.First
              onClick={() => handlePageChange(null, 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(null, currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next
              onClick={() => handlePageChange(null, currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(null, totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
          <div className="text-center mt-3">
            Page {currentPage} of {totalPages}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default HomePage;
