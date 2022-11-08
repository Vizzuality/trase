import React from 'react';
import { InView } from 'react-intersection-observer';
import { PropTypes } from 'prop-types';

function InViewFallback(props) {
  const { children } = props;
  if ('IntersectionObserver' in window && ENABLE_INTERSECTION_OBSERVER) {
    return <InView {...props} />;
  }

  return children({ inView: true });
}

InViewFallback.propTypes = {
  children: PropTypes.func.isRequired
};

export default InViewFallback;
