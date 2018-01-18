/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

function QuoteTile(props) {
  const {
    slide
  } = props;

  return (
    <div className="slide-quote">
      <p
        className="slide-quote-content"
        dangerouslySetInnerHTML={{ __html: `&ldquo;${slide.quote}&rdquo;` }}
      />
      <div className="c-author-footer">
        <figcaption className="author-details">
          <span>{slide.authorName}</span>
          <span>{slide.authorTitle}</span>
        </figcaption>
        <figure
          className="author-avatar"
          style={{ backgroundImage: slide.imageUrl && `url(${slide.imageUrl})` }}
        />
      </div>
    </div>
  );
}

QuoteTile.propTypes = {
  slide: PropTypes.shape({
    quote: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorTitle: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired
  }).isRequired
};

export default QuoteTile;
