import React from 'react';
import PropTypes from 'prop-types';
import unified from 'unified';
import parse from 'remark-parse';
import remarkReact from 'remark-react';
import cx from 'classnames';
import Link from 'redux-first-router-link';

const MarkdownRenderer = props => {
  const { content, className } = props;

  const MarkdownContainer = p => (
    <div className={cx('markdown-content', className)}>{p.children}</div>
  );
  const SmartLink = p => {
    const isAbsoluteLink = /^http(s)?:\/\//.test(p.href);
    const isEmail = /^mailto:/.test(p.href);
    if (!isAbsoluteLink && !isEmail) {
      return <Link to={p.href}>{p.children}</Link>;
    }
    return (
      <a href={p.href} target="_blank" rel="noopener noreferrer" tx-content="translate_urls">
        {p.children}
      </a>
    );
  };
  return unified()
    .use(parse)
    .use(remarkReact, { remarkReactComponents: { div: MarkdownContainer, a: SmartLink } })
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
