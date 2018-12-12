import React from 'react';
import PropTypes from 'prop-types';

import './author-footer.scss';

function AuthorFooter(props) {
  return (
    <div className="c-author-footer">
      <figcaption className="author-details">{props.details}</figcaption>
      <figure
        className="author-avatar"
        style={{ backgroundImage: props.imageUrl && `url(${props.imageUrl})` }}
      />
    </div>
  );
}

AuthorFooter.propTypes = {
  details: PropTypes.any,
  imageUrl: PropTypes.string
};

export default AuthorFooter;
