import React from 'react';
import PropTypes from 'prop-types';
import { ImgBackground } from 'react-components/shared/img';

import './author-footer.scss';

function AuthorFooter(props) {
  return (
    <div className="c-author-footer">
      <figcaption className="author-details">{props.details}</figcaption>
      <ImgBackground as="figure" className="author-avatar" src={props.imageUrl} />
    </div>
  );
}

AuthorFooter.propTypes = {
  details: PropTypes.any,
  imageUrl: PropTypes.string
};

export default AuthorFooter;
