import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import cx from 'classnames';
import Heading from 'react-components/shared/heading/heading.component';
import Img, { ImgBackground } from 'react-components/shared/img';
import Text from 'react-components/shared/text';
import { TOOL_LAYOUT, BREAKPOINTS } from 'constants';
import ResizeListener from 'react-components/shared/resize-listener.component';

import './entrypoints.scss';

const getEntrypointsData = defaultContext => {
  const defaultParams = defaultContext
    ? {
        countries: defaultContext.countryId,
        commodities: defaultContext.commodityId
      }
    : {};

  return [
    {
      link: { type: 'tool', payload: { serializerParams: defaultParams } },
      subtitle: 'Supply Chain',
      text:
        'Follow trade flows to identify sourcing regions, profile supply chain risks and' +
        ' assess opportunities for sustainable production.',
      className: '-supply-chain',
      src: '/images/backgrounds/home_trase_supply.png'
    },
    {
      link: { type: 'profiles' },
      subtitle: 'Profile',
      text:
        'View the trade and sustainability profile of a particular' +
        ' company or production region.',
      className: '-profile',
      src: '/images/backgrounds/home_trase_profiles.png'
    },
    {
      link: {
        type: 'tool',
        payload: { serializerParams: { toolLayout: TOOL_LAYOUT.left, ...defaultParams } }
      },
      subtitle: 'Map',
      text:
        'Explore the sustainability of different production regions and identify risks and' +
        ' opportunities facing downstream buyers.',
      className: '-map',
      src: '/images/backgrounds/home_trase_map.png'
    }
  ];
};

const Entrypoints = props => {
  const renderEntrypointText = slide => (
    <>
      <Heading variant="mono" color="pink" size="xs" as="h2">
        {slide.subtitle}
      </Heading>
      <Text as="p" color="grey" size="xl" variant="sans" lineHeight="xl">
        {slide.text}
      </Text>
    </>
  );

  const { onClick, defaultContext } = props;
  const data = getEntrypointsData(defaultContext);
  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const isSmallResolution = windowWidth <= BREAKPOINTS.small;
        return (
          <div className="c-entrypoints">
            {data.map(slide => (
              <div key={slide.subtitle} className="column">
                {isSmallResolution ? (
                  <ImgBackground
                    className={cx('entrypoint-slide', slide.className)}
                    onClick={() => onClick(slide.link)}
                    src={slide.src}
                  >
                    <Link to={slide.link}>
                      <div className="entrypoint-slide-content">{renderEntrypointText(slide)}</div>
                    </Link>
                  </ImgBackground>
                ) : (
                  <div
                    className={cx('entrypoint-slide', slide.className)}
                    onClick={() => onClick(slide.link)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="row">
                      <Link to={slide.link} className="row-link">
                        <div className="entrypoint-content">
                          <div className="entrypoint-text">{renderEntrypointText(slide)}</div>
                          <Img loading="lazy" src={slide.src} alt={slide.subtitle} />
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }}
    </ResizeListener>
  );
};

Entrypoints.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default Entrypoints;
