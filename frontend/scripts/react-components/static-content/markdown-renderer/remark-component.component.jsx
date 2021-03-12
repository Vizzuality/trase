import React, { useEffect } from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import remark from 'remark';
import remarkReact from 'remark-react';
import slugs from 'remark-slug';
import autolinkHeadings from 'remark-autolink-headings';

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

  // We need to use this to scroll to the anchors as the markdown wont be loaded immediately
  useEffect(() => {
    if (document.location.hash) {
      setTimeout(() => {
        document
          .querySelector(document.location.hash)
          .scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, []);

  const MarkdownContainer = p => (
    <div className={cx('markdown-content', className)}>{p.children}</div>
  );
  return (
    remark()
      .use(remarkReact, { remarkReactComponents: { div: MarkdownContainer, a: SmartLink } })
      .use(slugs)
      // Note that this module must be included after `remark-slug`.
      .use(autolinkHeadings)
      .processSync(content).contents
  );
}

RemarkComponent.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string
};

export default RemarkComponent;
