import React from 'react';
import Heading from 'react-components/shared/heading/heading.component';

function OldBrowserFallback() {
  return (
    <div className="l-old-browser-fallback">
      <Heading weight="bold">
        It looks like you&apos;re using an old browser. In order to get the full Trase experience
        download a more modern browser.
      </Heading>
    </div>
  );
}

export default OldBrowserFallback;
