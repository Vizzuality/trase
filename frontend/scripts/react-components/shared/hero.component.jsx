import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function Hero(props) {
  const { className } = props;
  return (
    <div className={cx('c-hero', className)}>
      <div className="row align-middle">
        <div className="column small-12">
          <div className="hero-logo-container">
            <img src="images/logos/new-logo-trase.svg" alt="TRASE" />
          </div>
          <h1 className="hero-title">
            Transparent supply chains for sustainable economies
          </h1>
          <div className="hero-play-container">
            <button className="hero-play-button" />
            TRASE in 2’
          </div>
        </div>
        <div className="layover">
          <div className="dummy-box">
            box
          </div>
        </div>
      </div>
    </div>
  );
}

Hero.propTypes = {
  className: PropTypes.string
};

export default Hero;
