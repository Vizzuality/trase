import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';

const MarkdownRenderer = props => {
  const { content } = props;

  const MarkdownContainer = p => <div className="markdown-content">{p.children}</div>;
  return remark()
    .use(remarkReact, { remarkReactComponents: { div: MarkdownContainer } })
    .processSync(content).contents;
};

MarkdownRenderer.propTypes = {
  content: PropTypes.string
};

export default MarkdownRenderer;
