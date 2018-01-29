import React from 'react';
import PropTypes from 'prop-types';

function StoryTile(props) {
  const {
    slide
  } = props;

  return (
    <a
      className="slide-link"
      href={slide.completePostUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <figure
        className="slide-image"
        style={{ backgroundImage: `url(${slide.imageUrl})` }}
      />
      <figcaption className="slide-content">
        <h4 className="home-subtitle">{slide.category}</h4>
        <p className="slide-title">{slide.title}</p>
      </figcaption>
    </a>
  );
}

StoryTile.propTypes = {
  slide: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    imageUrl: PropTypes.string,
    completePostUrl: PropTypes.string
  }).isRequired
};

export default StoryTile;
