/* eslint-disable react/no-danger */
import React from 'react';
import showdown from 'showdown';
import PropTypes from 'prop-types';
import cx from 'classnames';

const converter = new showdown.Converter();

// THIS COMPONENT IS A FALLBACK FOR IE11 – TEST IE11 BEFORE THINKING ON REMOVING
function ShowdownComponent(props) {
  return (
    <div
      className={cx('markdown-content', props.className)}
      dangerouslySetInnerHTML={{ __html: converter.makeHtml(props.content) }}
    />
  );
}

ShowdownComponent.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string
};

export default ShowdownComponent;
