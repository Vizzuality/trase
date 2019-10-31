import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ColumnsSelectorGroupContainer from 'react-components/tool/columns-selector-group/columns-selector-group.container';
import MapContainer from 'react-components/tool/map/map.container';
import ModalContainer from 'react-components/tool/story-modal/story-modal.container';
import Sankey from 'react-components/tool/sankey';
import Tooltip from 'react-components/tool/help-tooltip/help-tooltip.container';
import SplittedView from 'react-components/tool/splitted-view';
import MapLayout from 'react-components/tool/map-layout';
import ErrorModal from 'react-components/tool/error-modal';
import ToolModal from 'react-components/tool/tool-modal';
import EventManager from 'utils/eventManager';
import UrlSerializer from 'react-components/shared/url-serializer';
import nodesPanelSerializer from 'react-components/nodes-panel/nodes-panel.serializers';

import Timeline from './timeline';

import 'styles/layouts/l-tool.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/tool/map/map-sidebar.scss';

const evManager = new EventManager();

const renderVainillaComponents = () => (
  <>
    <ModalContainer />
    <MapContainer />
    <Tooltip />
  </>
);

const Tool = props => {
  const {
    resizeSankeyTool,
    urlProps,
    urlPropHandlers,
    mapSidebarOpen,
    noLinksFound,
    activeModal
  } = props;
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
          <ErrorModal noLinksFound={noLinksFound} />
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
          </div>
          <Timeline />
        </div>
        <ToolModal activeModal={activeModal} />
      </>
    ),
    [mapSidebarOpen, noLinksFound, activeModal]
  );

  return (
    <div>
      {render}
      {renderVainillaComponents()}
      <UrlSerializer
        urlProps={urlProps}
        urlPropHandlers={{
          ...urlPropHandlers,
          ...nodesPanelSerializer.urlPropHandlers
        }}
      />
    </div>
  );
};

Tool.propTypes = {
  resizeSankeyTool: PropTypes.func.isRequired,
  urlPropHandlers: PropTypes.object,
  urlProps: PropTypes.object,
  mapSidebarOpen: PropTypes.bool,
  noLinksFound: PropTypes.bool,
  activeModal: PropTypes.string
};

export default Tool;
