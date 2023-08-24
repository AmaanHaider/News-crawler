import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { motion } from "framer-motion"; 
import "react-multi-carousel/lib/styles.css";
import ArticleCarousel from "../components/ArticleCarousel";

function ArticlePage() {
  const [article, setArticle] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/newsarticle/${id}`)
      .then((response) => {
        setArticle(response.data);
        if (response.data.authorname) {
          setAuthorName(response.data.authorname);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

 

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Container fluid>
          <Row>
            <Col md={8} className="mx-auto mt-4 text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div>Error: {error.message}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Container fluid>
        <Row>
          <Col md={8} className="mx-auto mt-4">
            <div className="text-center">
              {article.articleImageSrc && (
                <img
                  src={article.articleImageSrc}
                  className="img-fluid mb-3"
                  alt={article.title}
                />
              )}
              <h1 className="mb-3">{article.headline}</h1>
              {article.description && (
                <h3 className="text-muted">{article.description}</h3>
              )}
              {authorName && (
                <p className="text-left">
                  <strong>Author:</strong> {authorName}
                </p>
              )}
              <p className="mt-4">
                <em>{article.date}</em>
              </p>
            </div>
            <p className="mt-4">{article.articleContent}</p>
          </Col>
        </Row>
        <ArticleCarousel />
        <Row className="bg-light mt-4 mb-4">
          <Col>
            <div className="container text-center">
              <Link to="/" className="btn btn-primary">
                Go Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}

export default ArticlePage;
