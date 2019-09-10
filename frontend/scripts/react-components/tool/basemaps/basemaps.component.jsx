import React from 'react';
import PropTypes from 'prop-types';
import { ImgBackground } from 'react-components/shared/img/img';
import Text from 'react-components/shared/text';
import cx from 'classnames';

import './basemaps.scss';

function Basemaps(props) {
  const { activeBasemapId, basemaps, selectBasemap } = props;
  return (
    <div className="c-basemaps">
      <ul className="basemaps-container">
        {basemaps.map(basemap => (
          <li
            className={cx('basemap-item', {
              '-active': activeBasemapId === basemap.id
            })}
          >
            <button className="basemap-item-button" onClick={() => selectBasemap(basemap.id)}>
              <ImgBackground src={basemap.thumbnail} className="basemap-thumb" />
              <Text variant="mono" transform="uppercase" weight="light" className="basemap-title">
                {basemap.title}
              </Text>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Basemaps.propTypes = {
  basemaps: PropTypes.array,
  selectBasemap: PropTypes.func,
  activeBasemapId: PropTypes.string
};

export default Basemaps;
