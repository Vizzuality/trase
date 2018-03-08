import React from 'react';
import Siema from 'react-siema';
import Link from 'redux-first-router-link';

const Entrypoints = () => (
  <div className="c-entrypoints">
    <div className="row">
      <Siema draggable perPage={2.3}>
        <div className="column small-6">
          <div className="entrypoint-slide">
            <div className="entrypoint-slide-content">
              <h3 className="subtitle">Profile</h3>
              <Link to={{ type: 'profileRoot' }}>
                <p className="entrypoint-text">
                  View the trade and sustainability profile of a particular company or production
                  region.
                </p>
              </Link>
            </div>
            <img
              alt="company or production region profile pages"
              className="entrypoint-slide-img"
              src="/images/backgrounds/entrypoint-1@2x.jpg"
            />
          </div>
        </div>
        <div className="column small-6">
          <div className="entrypoint-slide">
            <div className="entrypoint-slide-content">
              <h3 className="subtitle">Supply Chain</h3>
              <Link to={{ type: 'profileRoot' }}>
                <p className="entrypoint-text">
                  Follow trade flows to identify sourcing regions, profile supply chain risks and
                  assess opportunities for sustainable production.
                </p>
              </Link>
            </div>
            <img
              alt="trade flows page"
              className="entrypoint-slide-img"
              src="/images/backgrounds/entrypoint-2@2x.jpg"
            />
          </div>
        </div>
        <div className="column small-6">
          <div className="entrypoint-slide">
            <div className="entrypoint-slide-content">
              <h3 className="subtitle">Profile</h3>
              <Link to={{ type: 'profileRoot' }}>
                <p className="entrypoint-text">
                  Explore the sustainability of different production regions and identify risks and
                  opportunities facing downstream buyers.
                </p>
              </Link>
            </div>
            <img
              alt="production regions"
              className="entrypoint-slide-img"
              src="/images/backgrounds/entrypoint-3@2x.jpg"
            />
          </div>
        </div>
      </Siema>
    </div>
  </div>
);

export default Entrypoints;
