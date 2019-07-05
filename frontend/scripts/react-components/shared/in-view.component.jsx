import React from 'react';
import { InView } from 'react-intersection-observer';

function InViewFallback(props) {
  if ('IntersectionObserver' in window && !NODE_ENV_TEST) {
    return <InView {...props} />;
  }

  return props.children({ inView: true });
}

export default InViewFallback;
