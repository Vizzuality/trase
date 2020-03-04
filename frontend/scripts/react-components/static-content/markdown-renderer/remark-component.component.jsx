import cx from 'classnames';
import Link from 'redux-first-router-link';
import remark from 'remark';
import remarkReact from 'remark-react';
import React from 'react';
import PropTypes from 'prop-types';

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

function RemarkComponent(props) {
  const { content, className } = props;
  const MarkdownContainer = p => (
    <div className={cx('markdown-content', className)}>{p.children}</div>
  );
  return remark()
    .use(remarkReact, { remarkReactComponents: { div: MarkdownContainer, a: SmartLink } })
    .processSync(content).contents;
}

RemarkComponent.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string
};

export default RemarkComponent;
