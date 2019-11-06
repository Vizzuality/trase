import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/tool/map-sidebar-layout/map-sidebar-layout.scss';
import { TOOL_LAYOUT } from 'constants';
import cx from 'classnames';

const MapSidebar = ({ toolLayout, open }) => (
  <div
    className={cx('c-map-sidebar js-map-sidebar', {
      'is-hidden': !open || toolLayout === TOOL_LAYOUT.right
    })}
  >
    <div className="js-dimensions">{/* this is rendered by map-dimensions.component  */}</div>

    <div className="map-sidebar-group c-map-context js-map-context is-hidden">
      <div className="map-sidebar-group-title">Contextual layers</div>
      <ul className="map-sidebar-group-items js-map-context-items">
        {/* this is rendered by map-context.component */}
      </ul>
    </div>
  </div>
);

MapSidebar.propTypes = {
  toolLayout: PropTypes.number,
  open: PropTypes.bool
};

export default MapSidebar;
