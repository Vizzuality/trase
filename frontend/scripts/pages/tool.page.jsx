/* eslint-disable no-new */

import ToolMarkup from 'html/tool.ejs';
import SearchMarkup from 'html/includes/_search.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/layouts/l-tool.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/tool/map/map-sidebar.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import FlowContentContainer from 'containers/tool/tool-content.container';
import ColumnsSelectorGroupContainer from 'react-components/tool/columns-selector-group/columns-selector-group.container';
import MapContextContainer from 'containers/tool/map-context.container';
import MapContainer from 'containers/tool/map.container';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import TitlebarContainer from 'containers/tool/titlebar.container';
import NodesTitlesContainer from 'containers/tool/nodesTitles.container';
import ModalContainer from 'containers/tool/story-modal.container';
import TooltipContainer from 'containers/shared/help-tooltip.container';
import MapLegend from 'react-components/tool/map-legend/map-legend.container';
import MapBasemaps from 'react-components/tool/map-basemaps/map-basemaps.container';
import Sankey from 'react-components/tool/sankey/sankey.container';

import {
  resizeSankeyTool,
  loadDisclaimerTool,
  loadStoryModalTool,
  setToolLoaders
} from 'react-components/tool/tool.thunks';
import MapDimensionsContainer from 'containers/tool/map-dimensions.container';

import EventManager from 'utils/eventManager';

const evManager = new EventManager();
let containers = [];

export const mount = (root, store) => {
  root.innerHTML = ToolMarkup({
    search: SearchMarkup(),
    feedback: FeedbackMarkup()
  });

  containers = [
    new FlowContentContainer(store),
    new MapContainer(store),
    new MapDimensionsContainer(store),
    new MapContextContainer(store),
    new TitlebarContainer(store),
    new NodesTitlesContainer(store),
    new TooltipContainer(store),
    new ModalContainer(store)
  ];

  // TODO remove this
  // In order to avoid adding loading states when not needed we check that the selectedContext
  // has indeed changed.
  const { app, tool } = store.getState();
  if ((app.selectedContext && app.selectedContext.id) !== tool.loadedFlowsContextId) {
    setToolLoaders(store.dispatch);
  }
  loadDisclaimerTool(store.dispatch);
  loadStoryModalTool(store.dispatch, store.getState);
  resizeSankeyTool(store.dispatch);

  render(
    <Provider store={store}>
      <FiltersNav />
    </Provider>,
    document.getElementById('js-tool-nav-react')
  );

  render(
    <Provider store={store}>
      <ColumnsSelectorGroupContainer />
    </Provider>,
    document.getElementById('js-columns-selector-react')
  );

  render(
    <Provider store={store}>
      <>
        <MapLegend />
        <MapBasemaps />
        <Sankey />
      </>
    </Provider>,
    document.getElementById('js-react-vanilla-bridge-container')
  );

  evManager.addEventListener(window, 'resize', () => resizeSankeyTool(store.dispatch));
  document.querySelector('body').classList.add('-overflow-hidden');
};

export const unmount = () => {
  evManager.clearEventListeners();
  unmountComponentAtNode(document.getElementById('js-tool-nav-react'));
  unmountComponentAtNode(document.getElementById('js-columns-selector-react'));
  unmountComponentAtNode(document.getElementById('js-react-vanilla-bridge-container'));
  document.querySelector('body').classList.remove('-overflow-hidden');
  containers.forEach(container => container.remove());
};
