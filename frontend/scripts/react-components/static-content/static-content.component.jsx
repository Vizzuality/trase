import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import NotFound from './not-found.component';

import 'scripts/react-components/static-content/static-content.scss';

function StaticContent(props) {
  const { Content, notFound } = props;
  return (
    <div className="c-static-content">
      {notFound ? <NotFound /> : <Suspense fallback={null}>{Content && <Content />}</Suspense>}
    </div>
  );
}

StaticContent.propTypes = {
  Content: PropTypes.func,
  notFound: PropTypes.bool
};

export default React.memo(StaticContent);
