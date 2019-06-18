import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Feedback from 'react-components/shared/feedback';
import 'styles/components/tool/map/map-basemaps.scss';
import CookieBanner from 'react-components/shared/cookie-banner';
import ColumnsSelectorGroupContainer from 'react-components/tool/columns-selector-group/columns-selector-group.container';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import MapContainer from 'react-components/tool/map/map.container';
import FlowContentContainer from 'react-components/tool/tool-content/tool-content.container';
import TooltipContainer from 'react-components/tool/help-tooltip/help-tooltip.container';
import ModalContainer from 'react-components/tool/story-modal/story-modal.container';
import TitlebarContainer from 'react-components/tool/titlebar/titlebar.container';
import NodesTitlesContainer from 'react-components/tool/nodes-titles/nodes-titles.container';
import MapContextContainer from 'react-components/tool/map-context/map-context.container';
import MapBasemaps from 'react-components/tool/map-basemaps/map-basemaps.container';
import Sankey from 'react-components/tool/sankey/sankey.container';
import MapLegend from 'react-components/tool/map-legend/map-legend.container';
import MapDimensionsContainer from 'react-components/tool/map-dimensions/map-dimensions.react';
import EventManager from 'utils/eventManager';
import UrlSerializer from 'react-components/shared/url-serializer';
import * as AppUrlSerializers from 'reducers/app.serializers';

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

    <div className="map-sidebar-group c-map-basemaps">
      <div className="map-sidebar-group-title">Basemaps</div>
      <ul className="map-sidebar-group-items js-map-basemaps-items">
        {/* this is rendered by map-context.component */}
      </ul>
    </div>
  </div>
);

const renderMap = () => (
  <div className="js-map-container c-map is-absolute">
    <div id="js-map" className="c-map-leaflet" />
    <div className="btn-map -toggle-map js-toggle-map" />
    <div className="js-map-warnings-container map-warnings">
      <div className="warning-wrapper">
        <svg className="icon">
          <use xlinkHref="#icon-warning" />
        </svg>
        <span className="js-map-warnings" />
      </div>
    </div>
    <div className="c-map-footer">
      <div className="btn-map -map-layers js-basemap-switcher">
        <svg className="icon icon-layers">
          <use xlinkHref="#icon-layers" />
        </svg>
      </div>
      <div className="c-map-legend js-map-legend">
        <div className="js-map-legend-context c-map-legend-context" />
        <div className="js-map-legend-choro c-map-legend-choro" />
      </div>
    </div>
    <div className="js-map-attribution c-map-attribution">
      {/* this is rendered by map.component */}
    </div>
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

const renderExpandButton = () => (
  <div className="expand-button js-expand">
    <svg className="icon icon-outside-link">
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-more-options" />
    </svg>
    <div className="c-node-menu">
      <ul className="actions">
        <li
          className="expand-action js-expand-action is-hidden"
          data-expand-text="EXPAND"
          data-re-expand-text="RE-EXPAND"
        >
          <svg className="icon">
            <use xlinkHref="#icon-more-options" />
          </svg>
        </li>
        <li className="collapse-action js-collapse-action is-hidden">
          COLLAPSE
          <svg className="icon">
            <use xlinkHref="#icon-more-options" />
          </svg>
        </li>
        <li className="js-clear">CLEAR SELECTION</li>
      </ul>
    </div>
  </div>
);

const renderSankey = () => (
  <div className="c-sankey is-absolute js-sankey">
    <div className="js-sankey-scroll-container sankey-scroll-container">
      <svg className="js-sankey-canvas sankey">
        <defs>
          <pattern
            id="isAggregatedPattern"
            x="0"
            y="0"
            width="1"
            height="3"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="50" height="1" fill="#ddd" />
            <rect x="0" y="1" width="50" height="2" fill="#fff" />
          </pattern>
        </defs>
        <g className="sankey-container">
          <g className="sankey-links" />
          <g className="sankey-columns">
            <g className="sankey-column">
              <g className="sankey-nodes" />
            </g>
            <g className="sankey-column">
              <g className="sankey-nodes" />
            </g>
            <g className="sankey-column">
              <g className="sankey-nodes" />
            </g>
            <g className="sankey-column">
              <g className="sankey-nodes" />
            </g>
          </g>
        </g>
      </svg>
    </div>

    {renderExpandButton()}
  </div>
);

const renderVainillaComponents = () => (
  <>
    <MapContainer />
    <MapBasemaps />
    <MapDimensionsContainer />
    <FlowContentContainer />
    <MapLegend />
    <MapContextContainer />
    <NodesTitlesContainer />
    <Sankey />
    <TooltipContainer />
    <ModalContainer />
  </>
);

const Tool = props => {
  const { resizeSankeyTool, urlProps } = props;
  useEffect(() => {
    evManager.addEventListener(window, 'resize', resizeSankeyTool);
    document.querySelector('body').classList.add('-overflow-hidden');
    return () => {
      evManager.clearEventListeners();
      document.querySelector('body').classList.remove('-overflow-hidden');
    };
  }, [resizeSankeyTool]);

  const render = useMemo(
    () => (
      <>
        <div className="js-node-tooltip c-info-tooltip" />
        <div className="js-sankey-tooltip c-info-tooltip" />
        <div className="l-tool">
          {renderVainillaComponents()}

          <nav className="tool-nav">
            <FiltersNav />
          </nav>

          <div className="-hidden-on-mobile">
            <div className="veil js-veil" />
            <div className="c-modal js-modal" />
          </div>

          {renderSankeyError()}

          <div className="js-tool-content flow-content">
            <div className="js-tool-loading tool-loading">
              <div className="veil sankey-veil" />
              <div className="c-spinner" />
            </div>

            <div className="js-map-view-veil sankey-veil veil is-hidden" />
            {renderMapSidebar()}
            {renderMap()}
            <ColumnsSelectorGroupContainer />
            {renderSankey()}
            <TitlebarContainer />
          </div>
          <CookieBanner />
        </div>
        <Feedback />
      </>
    ),
    []
  );

  return (
    <div>
      {render}
      <UrlSerializer urlProps={urlProps} urlPropHandlers={AppUrlSerializers} />
    </div>
  );
};

Tool.propTypes = {
  resizeSankeyTool: PropTypes.func.isRequired,
  urlProps: PropTypes.object
};

export default Tool;
