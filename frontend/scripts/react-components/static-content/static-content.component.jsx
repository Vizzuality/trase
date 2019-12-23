import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import Hero from 'react-components/shared/hero/hero.component';
import NotFound from './not-found.component';

import 'scripts/react-components/static-content/static-content.scss';

function StaticContent(props) {
  const { Content, notFound } = props;

  return (
    <div className="c-static-content">
      <Hero className="-read-only" />
      {notFound && <NotFound />}
      {notFound === false && (
        <Suspense fallback={null}>
          <Content />
        </Suspense>
      )}
    </div>
  );
}

StaticContent.propTypes = {
  Content: PropTypes.func,
  notFound: PropTypes.bool
};

export default React.memo(StaticContent);
