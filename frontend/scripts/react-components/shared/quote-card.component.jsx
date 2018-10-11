/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

function QuoteCard(props) {
  const { quote, imageUrl, name, title } = props;

  return (
    <div className="c-quote-card">
      <div className="quote-card-container">
        <p
          className="quote-card-content"
          dangerouslySetInnerHTML={{ __html: `&ldquo;${quote}&rdquo;` }}
        />
        <div className="c-author-footer">
          <figcaption className="author-details">
            <span>{name}</span>
            <span>{title}</span>
          </figcaption>
          <figure
            className="author-avatar"
            style={{ backgroundImage: imageUrl && `url(${imageUrl})` }}
          />
        </div>
      </div>
    </div>
  );
}

QuoteCard.propTypes = {
  quote: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};

export default QuoteCard;
