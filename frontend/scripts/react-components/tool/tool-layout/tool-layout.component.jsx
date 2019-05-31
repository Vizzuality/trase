import React from 'react';
import Feedback from 'react-components/shared/feedback';
import 'styles/components/tool/map/map-basemaps.scss';

export default () => (
  <div>
    <div className="js-node-tooltip c-info-tooltip" />
    <div className="js-sankey-tooltip c-info-tooltip" />
    <div className="loading-wrapper">
      <div className="l-tool">
        <div id="js-react-vanilla-bridge-container" />

        <nav className="tool-nav" id="js-tool-nav-react" />

        <div className="-hidden-on-mobile">
          <div className="veil js-veil" />
          <div className="c-modal js-modal" />
        </div>

        <div className="js-sankey-error is-hidden">
          <div className="veil -with-menu -below-nav" />
          <div className="c-modal -below-nav">
            <div className="content -auto-height">
              The current selection produced no results. This may be due to data not being available
              for the current configuration or due to an error in loading the data. Please change
              your selection or reset the tool to its default settings.
              <button className="c-button js-sankey-reset">reset</button>
            </div>
          </div>
        </div>

        <div className="js-tool-content flow-content">
          <div className="js-tool-loading tool-loading">
            <div className="veil sankey-veil" />
            <div className="c-spinner" />
          </div>

          <div className="js-map-view-veil sankey-veil veil is-hidden" />

          <div className="c-map-sidebar is-absolute">
            <div className="js-dimensions">
              {/* this is rendered by map-dimensions.component  */}
            </div>

            <div className="map-sidebar-group c-map-context js-map-context is-hidden">
              <div className="map-sidebar-group-title">Contextual layers</div>
              <ul className="map-sidebar-group-items js-map-context-items">
                {/* <!-- this is rendered by map-context.component --> */}
              </ul>
            </div>

            <div className="map-sidebar-group c-map-basemaps">
              <div className="map-sidebar-group-title">Basemaps</div>
              <ul className="map-sidebar-group-items js-map-basemaps-items">
                {/* <!-- this is rendered by map-context.component --> */}
              </ul>
            </div>
          </div>

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
              {/* <!-- this is rendered by map.component --> */}
            </div>
          </div>

          <div id="js-columns-selector-react" />

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
          </div>

          <div className="c-titlebar">
            <div className="c-node-title-group js-nodes-titles">
              <div className="js-nodes-titles-container" />
              <div className="c-nodes-clear js-nodes-titles-clear is-hidden">
                <div className="button icon-button">
                  <svg className="icon">
                    <use xlinkHref="#icon-close" />
                  </svg>
                </div>
                <div className="button text-button js-text-button">clear selection</div>
              </div>
            </div>
          </div>
        </div>
        <div id="cookie-banner" />
      </div>
      {<Feedback />}
    </div>
  </div>
);
