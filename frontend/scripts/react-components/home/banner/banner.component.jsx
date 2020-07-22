import React, { Fragment, useState, useEffect } from 'react';
import { useTransition, animated, config } from 'react-spring';

import './banner-styles.scss';

const slides = [
  {
    id: 0,
    imageName: 'banner2x_01.png'
  },
  {
    id: 1,
    imageName: 'banner2x_02.png'
  }
];

function Banner() {
  const [index, set] = useState(0);
  const [backgroundInterval, setBackgroundInterval] = useState();
  const transitions = useTransition(slides[index], item => item.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses
  });

  useEffect(() => {
    let mounted = true; // React state update on an unmounted component error
    setBackgroundInterval(
      setInterval(() => {
        if (mounted) {
          set(state => (state + 1) % 2);
        }
      }, 6000)
    );
    return function cleanup() {
      mounted = false;
      clearInterval(backgroundInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="c-banner">
      {transitions.map(({ item, props, key }) => (
        <Fragment key={key}>
          <div className="background-white" />
          <animated.div
            className="background-image"
            style={{
              ...props,
              backgroundImage: `url('/images/banner/${item.imageName}')`
            }}
          >
            <a
              title="New Trase yearbook 2020"
              href="https://insights.trase.earth/yearbook/summary/"
              target="_blank"
              rel="noopener noreferrer"
              className="banner-content"
            >
              <div className="banner-title">The new Trase Yearbook 2020 is now available</div>
              <div className="banner-link">Open yearbook</div>
            </a>
          </animated.div>
        </Fragment>
      ))}
    </div>
  );
}

export default Banner;
