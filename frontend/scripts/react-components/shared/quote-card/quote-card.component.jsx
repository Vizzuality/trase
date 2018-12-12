/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import AuthorFooter from '../../home/author-footer/author-footer.component';

import './quote-card.scss';

function QuoteCard(props) {
  const { quote, imageUrl, name, title } = props;

  return (
    <div className="c-quote-card">
      <div className="quote-card-container">
        <p
          className="quote-card-content"
          dangerouslySetInnerHTML={{ __html: `&ldquo;${quote}&rdquo;` }}
        />
        <AuthorFooter
          details={
            <React.Fragment>
              <span>{name}</span>
              <span>{title}</span>
            </React.Fragment>
          }
          imageUrl={imageUrl}
        />
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
