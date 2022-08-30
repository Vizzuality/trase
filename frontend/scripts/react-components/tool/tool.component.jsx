import React, { useEffect, useMemo, Suspense } from 'react';
import PropTypes from 'prop-types';
import EventManager from 'utils/eventManager';
import ColumnsSelectorGroupContainer from 'react-components/tool/columns-selector-group/columns-selector-group.container';
import ModalContainer from 'react-components/tool/story-modal/story-modal.container';
import SplittedView from 'react-components/tool/splitted-view';
import MapBoxMap from 'react-components/tool/map/map';
import Timeline from 'react-components/tool/timeline';
import TimelineLegacy from 'react-components/tool/timeline-legacy';
import ToolBar from 'react-components/shared/tool-bar';
import UrlSerializer from 'react-components/shared/url-serializer';
import useWindowSize from 'utils/hooks/useWindowSize';
import NotSupportedComponent from 'react-components/mobile/not-supported.component';
import { BREAKPOINTS } from 'constants';

import 'styles/components/shared/veil.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/tool/map/map-sidebar.scss';

const Sankey = React.lazy(() =>
  import(/* webpackChunkName: "sankey" */ /* webpackPreload: true */ './sankey')
);
const DataView = React.lazy(() =>
  import(/* webpackChunkName: "data-view" */ /* webpackPreload: true */ './data-view')
);
const ToolModal = React.lazy(() => import(/* webpackPreload: true */ './tool-modal'));
const ErrorModal = React.lazy(() => import(/* webpackPreload: true */ './error-modal'));

const evManager = new EventManager();

const renderVainillaComponents = () => (
  <>
    <ModalContainer />
  </>
);

function renderSankeyView() {
  return (
    <>
      <ColumnsSelectorGroupContainer />
      <Suspense fallback={null}>
        <Sankey />
      </Suspense>
    </>
  );
}

function renderDataView() {
  return (
    <Suspense fallback={null}>
      <DataView />
    </Suspense>
  );
}

const TimelineComponent = DISABLE_TOOL_RANGE ? Timeline : TimelineLegacy;

const Tool = props => {
  const {
    section,
    toolYearProps,
    selectYears,
    resizeSankeyTool,
    urlProps,
    urlPropHandlers,
    mapSidebarOpen,
    noLinksFound,
    activeModal
  } = props;

  const { width } = useWindowSize();

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
        <div className="l-tool">
          <div className="js-node-tooltip c-info-tooltip" />
          <div className="-hidden-on-mobile">
            <div className="veil js-veil" />
            <div className="c-modal js-modal" />
          </div>
          <Suspense fallback={null}>
            <ErrorModal noLinksFound={noLinksFound} />
          </Suspense>
          <div className="main-content">
            <ToolBar />
            <SplittedView
              sidebarOpen={mapSidebarOpen}
              leftSlot={<MapBoxMap />}
              rightSlot={section === 'data-view' ? renderDataView() : renderSankeyView()}
            />
          </div>
          <TimelineComponent
            {...toolYearProps}
            showBackground={section === 'data-view'}
            selectYears={selectYears}
          />
        </div>
        <Suspense fallback={null}>
          <ToolModal activeModal={activeModal} />
        </Suspense>
      </>
    ),
    [noLinksFound, mapSidebarOpen, section, toolYearProps, selectYears, activeModal]
  );

  if (width <= BREAKPOINTS.tablet) {
    return <NotSupportedComponent />;
  }

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
  selectYears: PropTypes.func.isRequired,
  urlPropHandlers: PropTypes.object,
  urlProps: PropTypes.object,
  mapSidebarOpen: PropTypes.bool,
  noLinksFound: PropTypes.bool,
  activeModal: PropTypes.string,
  section: PropTypes.string,
  toolYearProps: PropTypes.shape({
    years: PropTypes.array,
    selectedYears: PropTypes.array
  })
};

export default Tool;
