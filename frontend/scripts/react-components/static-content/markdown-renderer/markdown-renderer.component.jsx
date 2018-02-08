import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';
import cx from 'classnames';

const MarkdownRenderer = props => {
  const { content, className } = props;

  const MarkdownContainer = p => (
    <div className={cx('markdown-content', className)}>{p.children}</div>
  );
  return remark()
    .use(remarkReact, { remarkReactComponents: { div: MarkdownContainer } })
    .processSync(content).contents;
};

MarkdownRenderer.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string
};

MarkdownRenderer.defaultProps = {
  className: 'small-12 medium-9'
};

export default MarkdownRenderer;
