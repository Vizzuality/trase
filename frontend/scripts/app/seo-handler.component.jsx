import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import objectToQueryParams from 'utils/objectToQueryParams';

function SeoHandler() {
  const { type, pathname, query } = useSelector(state => state.location);
  const { origin } = window.location;
  let canonicalRef = origin;

  if (type === 'profile') {
    canonicalRef = `${canonicalRef}${pathname}`;
    if (query) {
      canonicalRef = `${canonicalRef}?${objectToQueryParams(query, {
        discard: ['year']
      })}`;
    }
  } else {
    canonicalRef = `${canonicalRef}${pathname}`;
  }

  return (
    <Helmet>
      <link rel="canonical" href={canonicalRef} />
    </Helmet>
  );
}

export default SeoHandler;
