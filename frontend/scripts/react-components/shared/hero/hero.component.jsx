import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import AnimatedFlows from 'react-components/animated-flows/animated-flows.component';
import InView from 'react-components/shared/in-view.component';

import './hero.scss';

// old school name: https://en.wikipedia.org/wiki/Hero_image
class Hero extends React.Component {
  render() {
    const { className } = this.props;

    return (
      <InView>
        {({ ref, inView }) => (
          <div className={cx('c-hero', className)} ref={ref}>
            {inView && <AnimatedFlows />}
          </div>
        )}
      </InView>
    );
  }
}

Hero.propTypes = {
  className: PropTypes.string
};

export default Hero;
