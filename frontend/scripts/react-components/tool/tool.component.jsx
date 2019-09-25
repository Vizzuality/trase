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
import Tooltip from 'react-components/tool/help-tooltip/help-tooltip.container';
import SplittedView from 'react-components/tool/splitted-view';
import MapLayout from 'react-components/tool/map-layout';
import MapSidebar from 'react-components/tool/map-sidebar-layout';
import LegacyBasemaps from 'react-components/tool/legacy-basemaps/legacy-basemaps.container';
import EventManager from 'utils/eventManager';
import UrlSerializer from 'react-components/shared/url-serializer';

import 'styles/layouts/l-tool.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/tool/map/map-sidebar.scss';

const evManager = new EventManager();
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
    <FlowContentContainer />
    <ModalContainer />
    <MapContainer />
    {!ENABLE_REDESIGN_PAGES && <LegacyBasemaps />}
    {!ENABLE_REDESIGN_PAGES && <NodesTitlesContainer />}
    <MapContextContainer />
    <Tooltip />
  </>
);

const Tool = props => {
  const { resizeSankeyTool, urlProps, urlPropHandlers, mapSidebarOpen } = props;
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
          <div className="-hidden-on-mobile">
            <div className="veil js-veil" />
            <div className="c-modal js-modal" />
          </div>
          {renderSankeyError()}
          <MapSidebar />
          <div className="main-content">
            <SplittedView
              sidebarOpen={mapSidebarOpen}
              leftSlot={<MapLayout />}
              rightSlot={
                <>
                  <ColumnsSelectorGroupContainer />
                  <Sankey />
                </>
              }
            />
            <TitlebarContainer />
          </div>
        </div>
      </>
    ),
    [mapSidebarOpen]
  );

  return (
    <div>
      {render}
      {renderVainillaComponents()}
      <UrlSerializer urlProps={urlProps} urlPropHandlers={urlPropHandlers} />
    </div>
  );
};

Tool.propTypes = {
  resizeSankeyTool: PropTypes.func.isRequired,
  urlPropHandlers: PropTypes.object,
  urlProps: PropTypes.object,
  mapSidebarOpen: PropTypes.bool
};

export default Tool;
