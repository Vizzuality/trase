import React from 'react';
import Img from 'react-components/shared/img';

const NotSupported = () => (
  <div className="l-not-supported">
    <section className="not-supported">
      <div className="row column">
        <Img src="/images/backgrounds/not-supported-on-mobile.svg" alt="Not supported on mobile" />
        <p className="not-supported-text">
          You&apos;ll need a bigger screen to explore the full commodity supply chains.
        </p>
      </div>
    </section>
  </div>
);

export default NotSupported;
