import React from 'react';
import PropTypes from 'prop-types';
import remark from 'remark';
import remarkReact from 'remark-react';

const MarkdownRenderer = props => {
  const { content } = props;

  const MarkdownContainer = p => (
    <div className="markdown-content small-11 medium-9">{p.children}</div>
  );
  return (
    <div className="row">
      {
        remark()
          .use(remarkReact, { remarkReactComponents: { div: MarkdownContainer } })
          .processSync(content).contents
      }
    </div>
  );
};

MarkdownRenderer.propTypes = {
  content: PropTypes.string
};

export default MarkdownRenderer;
