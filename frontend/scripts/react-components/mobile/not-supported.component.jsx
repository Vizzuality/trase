import React from 'react';

const NotSupported = () => (
  <div className="l-not-supported">
    <section className="not-supported">
      <div className="row column">
        <img src="/images/backgrounds/not-supported-on-mobile.svg" alt="Not supported on mobile" />
        <p className="not-supported-text">
          {"You'll need a bigger screen to explore the full commodity supply chains."}
        </p>
      </div>
    </section>
  </div>
);

export default NotSupported;
