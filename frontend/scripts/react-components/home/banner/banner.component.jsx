import React, { useState, useEffect, Fragment } from 'react';
import { useTransition, animated, config } from 'react-spring';

import './banner-styles.scss';

const slides = [
  {
    id: 0,
    text: 'Trase is featured in the BBC documentary \'Extinction: The Facts\'',
    link: 'https://medium.com/trase/extinction-the-facts-trase-featured-in-new-bbc-documentary-788073206fa9',
    imageName: 'banner2x_bbc.png'
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
    if (slides.length > 1) {
      setBackgroundInterval(setInterval(() => set(state => (state + 1) % 2), 6000));
    }
    return function cleanup() {
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
              title={item.text}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="banner-content"
            >
              <div className="banner-title">{item.text}</div>
              <div className="banner-link">See more</div>
            </a>
          </animated.div>
        </Fragment>
      ))}
    </div>
  );
};

export default Banner;
