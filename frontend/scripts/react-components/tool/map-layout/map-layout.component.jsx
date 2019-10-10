import React from 'react';
import PropTypes from 'prop-types';
import { TOOL_LAYOUT } from 'constants';
import Basemaps from 'react-components/tool/basemaps';
import Legend from 'react-components/tool/legend';
import cx from 'classnames';

const MapLayout = ({ toolLayout, toggleMapSidebar }) => {
  const fullscreen = toolLayout === TOOL_LAYOUT.right;
  const minified = toolLayout === TOOL_LAYOUT.right;
  return (
    <div className={cx('c-map', { '-fullscreen': fullscreen }, { '-minified': minified })}>
      <div id="js-map" className="c-map-leaflet" />
      {!minified && (
        <>
          {ENABLE_REDESIGN_PAGES && <Basemaps />}
          <div className="js-map-warnings-container map-warnings">
            <div className="warning-wrapper">
              <svg className="icon">
                <use xlinkHref="#icon-warning" />
              </svg>
              <span className="js-map-warnings" />
            </div>
          </div>
        </>
      )}
      <div className="c-map-footer">
        {!minified && (
          <button className="btn-map -map-layers" onClick={toggleMapSidebar}>
            <svg className="icon icon-layers">
              <use xlinkHref="#icon-layers" />
            </svg>
          </button>
        )}
        <div className="c-map-legend js-map-legend">
          <div className="js-map-legend-context c-map-legend-context" />
          <div className="js-map-legend-choro c-map-legend-choro" />
        </div>
      </div>
      <div className="js-map-attribution c-map-attribution">
        {/* this is rendered by map.component */}
      </div>
      <Legend />
    </div>
  )
};

MapLayout.propTypes = {
  toolLayout: PropTypes.number,
  toggleMapSidebar: PropTypes.func.isRequired
};

export default MapLayout;
