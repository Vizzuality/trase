import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import ErrorCatch from 'react-components/shared/error-catch.component';

// renders markdown as react using an AST - optimal (not working on IE11)
const RemarkComponent = React.lazy(() => import('./remark-component.component'));

// renders markdown as html using dangerouslySetInnerHTML - non optimal
const ShowdownComponent = React.lazy(() => import('./showdown-component.component'));

const MarkdownRenderer = props => (
  <Suspense fallback={null}>
    <ErrorCatch renderFallback={() => <ShowdownComponent {...props} />}>
      <RemarkComponent {...props} />
    </ErrorCatch>
  </Suspense>
);

MarkdownRenderer.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string
};

MarkdownRenderer.defaultProps = {
  className: 'small-12 medium-9'
};

export default MarkdownRenderer;
