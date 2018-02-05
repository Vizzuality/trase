import React from 'react';
import PropTypes from 'prop-types';

function StoryTile(props) {
  const { slide, action } = props;

  return (
    <React.Fragment>
      <a
        className="slide-link"
        href={slide.completePostUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <figure className="slide-image" style={{ backgroundImage: `url(${slide.imageUrl})` }} />
      </a>
      <figcaption className="slide-content">
        <div className="details-container">
          <h4 className="subtitle">{slide.category}</h4>
          <p className="slide-title">{slide.title}</p>
        </div>
        <a
          className="slide-action subtitle -gray"
          target="_blank"
          rel="noopener noreferrer"
          href={slide.completePostUrl}
        >
          {action}
        </a>
      </figcaption>
    </React.Fragment>
  );
}

StoryTile.propTypes = {
  slide: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    imageUrl: PropTypes.string,
    completePostUrl: PropTypes.string
  }).isRequired,
  action: PropTypes.string.isRequired
};

export default StoryTile;
