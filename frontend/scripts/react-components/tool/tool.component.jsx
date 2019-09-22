import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ColumnsSelectorGroupContainer from 'react-components/tool/columns-selector-group/columns-selector-group.container';
import MapContainer from 'react-components/tool/map/map.container';
import FlowContentContainer from 'react-components/tool/tool-content/tool-content.container';
import ModalContainer from 'react-components/tool/story-modal/story-modal.container';
import TitlebarContainer from 'react-components/tool/titlebar/titlebar.container';
import NodesTitlesContainer from 'react-components/tool/nodes-titles/nodes-titles.container';
import MapContextContainer from 'react-components/tool/map-context/map-context.container';
import Sankey from 'react-components/tool/sankey';
import MapDimensionsContainer from 'react-components/tool/map-dimensions/map-dimensions.react';
import Tooltip from 'react-components/tool/help-tooltip/help-tooltip.container';
import Basemaps from 'react-components/tool/basemaps';
import LayoutArrows from 'react-components/tool/layout-arrows';
import LegacyBasemaps from 'react-components/tool/legacy-basemaps/legacy-basemaps.container';
import Legend from 'react-components/tool/legend';
import EventManager from 'utils/eventManager';
import UrlSerializer from 'react-components/shared/url-serializer';
import Timeline from './timeline';

import 'styles/layouts/l-tool.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/tool/map/map-sidebar.scss';

const evManager = new EventManager();

const renderMapSidebar = () => (
  <div className="c-map-sidebar is-absolute">
    <div className="js-dimensions">{/* this is rendered by map-dimensions.component  */}</div>

    <div className="map-sidebar-group c-map-context js-map-context is-hidden">
      <div className="map-sidebar-group-title">Contextual layers</div>
      <ul className="map-sidebar-group-items js-map-context-items">
        {/* this is rendered by map-context.component */}
      </ul>
    </div>

    {!ENABLE_REDESIGN_PAGES && (
      <div className="map-sidebar-group c-map-basemaps">
        <div className="map-sidebar-group-title">Basemaps</div>
        <ul className="map-sidebar-group-items js-map-basemaps-items">
          {/* this is rendered by map-context.component */}
        </ul>
      </div>
    )}
  </div>
);

const renderMap = () => (
  <div className="js-map-container c-map is-absolute -smooth-transition">
    <div id="js-map" className="c-map-leaflet" />
    {ENABLE_REDESIGN_PAGES && <Basemaps />}
    {ENABLE_REDESIGN_PAGES && <LayoutArrows />}
    <div className="js-map-warnings-container map-warnings">
      <div className="warning-wrapper">
        <svg className="icon">
          <use xlinkHref="#icon-warning" />
        </svg>
        <span className="js-map-warnings" />
      </div>
    </div>
    <div className="js-map-attribution c-map-attribution">
      {/* this is rendered by map.component */}
    </div>
    <Legend />
  </div>
);

const renderSankeyError = () => (
  <div className="js-sankey-error is-hidden">
    <div className="veil -with-menu -below-nav" />
    <div className="c-modal -below-nav">
      <div className="content -auto-height">
        The current selection produced no results. This may be due to data not being available for
        the current configuration or due to an error in loading the data. Please change your
        selection or reset the tool to its default settings.
        <button className="c-button js-sankey-reset">reset</button>
      </div>
    </div>
  </div>
);

const renderVainillaComponents = () => (
  <>
    <MapContainer />
    <MapDimensionsContainer />
    <FlowContentContainer />
    <Tooltip />
    {!ENABLE_REDESIGN_PAGES && <LegacyBasemaps />}
    <MapContextContainer />
    {!ENABLE_REDESIGN_PAGES && <NodesTitlesContainer />}
    <ModalContainer />
  </>
);

const Tool = props => {
  const { resizeSankeyTool, urlProps, urlPropHandlers } = props;
  useEffect(() => {
    evManager.addEventListener(window, 'resize', resizeSankeyTool);
    const body = document.querySelector('body');
    body.classList.add('-overflow-hidden');
    const originalBackground = body.style.backgroundColor;
    body.style.backgroundColor = '#f2f2f2';
    return () => {
      evManager.clearEventListeners();
      body.classList.remove('-overflow-hidden');
      body.style.backgroundColor = originalBackground;
    };
  }, [resizeSankeyTool]);

  const render = useMemo(
    () => (
      <>
        <div className="js-node-tooltip c-info-tooltip" />
        <div className="l-tool">
          {renderVainillaComponents()}

          <div className="-hidden-on-mobile">
            <div className="veil js-veil" />
            <div className="c-modal js-modal" />
          </div>

          {renderSankeyError()}

          <div className="js-tool-content flow-content">
            {renderMapSidebar()}
            {renderMap()}
            <ColumnsSelectorGroupContainer />
            <Sankey />
            {!ENABLE_REDESIGN_PAGES && <TitlebarContainer />}
          </div>
          <Timeline />
        </div>
      </>
    ),
    []
  );

  return (
    <div>
      {render}
      <UrlSerializer urlProps={urlProps} urlPropHandlers={urlPropHandlers} />
    </div>
  );
};

Tool.propTypes = {
  resizeSankeyTool: PropTypes.func.isRequired,
  urlPropHandlers: PropTypes.object,
  urlProps: PropTypes.object
};

export default Tool;
