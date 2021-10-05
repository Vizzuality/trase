import React, { useEffect } from 'react';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import remark from 'remark';
import remarkReact from 'remark-react';
import slugs from 'remark-slug';
import autolinkHeadings from 'remark-autolink-headings';
import LinkCardsList from 'react-components/static-content/link-cards-list';
import PropTypes from 'prop-types';

const SmartLink = props => {
  const { href, children } = props;
  const isAbsoluteLink = /^http(s)?:\/\//.test(href);
  const isEmail = /^mailto:/.test(href);
  if (!isAbsoluteLink && !isEmail) {
    return <Link to={href}>{children}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" tx-content="translate_urls">
      {children}
    </a>
  );
};

SmartLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node
};

const LinksCardList = props => {
  const { children } = props;
  const isLinksList =
    children &&
    children.length > 0 &&
    children.some(
      child =>
        child.props?.children && child.props?.children[0] && child.props?.children[0].props?.href
    );
  if (isLinksList) {
    return <LinkCardsList data={children} />;
  }
  return children;
};

LinksCardList.propTypes = {
  children: PropTypes.node
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
      .use(remarkReact, {
        remarkReactComponents: { div: MarkdownContainer, a: SmartLink, ul: LinksCardList }
      })
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
