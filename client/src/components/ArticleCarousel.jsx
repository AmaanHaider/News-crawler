import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

function truncateText(text, maxLength) {
  const words = text.split(" ");
  if (words.length > maxLength) {
    return words.slice(0, maxLength).join(" ") + "...";
  }
  return text;
}

function ArticleCarousel() {
  const [suggestedArticles, setSuggestedArticles] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/news`)
      .then((response) => {
        setSuggestedArticles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suggested articles:", error);
      });
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      partialVisibilityGutter: 15,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 20,
    },
  };

  const cardStyle = {
    width: "15rem",
    height: "100%",
  };

  return (
    <Row className="bg-light">
      <Col>
        <div className="container">
          <h2 className="my-4">More Articles to Read</h2>
        </div>
        <Carousel
          responsive={responsive}
          swipeable
          draggable
          centerMode={false}
          ssr
          autoPlay
          infinite
          autoPlaySpeed={3000}
          keyBoardControl
          customTransition="all .5"
          transitionDuration={500}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {suggestedArticles.map((suggestedArticle) => (
            <div key={suggestedArticle._id}>
              <Card style={cardStyle}>
                <Card.Img variant="top" src={suggestedArticle.imageSrc} />
                <center>
                  <Card.Body>
                    <Card.Title>
                      {truncateText(suggestedArticle.title, 10)}
                    </Card.Title>
                    <Card.Text>
                      {truncateText(suggestedArticle.content, 20)}
                    </Card.Text>
                    <Link
                      to={`/news/${suggestedArticle._id}`} // Use Link to navigate
                      className="btn btn-primary"
                     
                    >
                      Read Full Article
                    </Link>
                  </Card.Body>
                </center>
              </Card>
            </div>
          ))}
        </Carousel>
      </Col>
    </Row>
  );
}

export default ArticleCarousel;
