/* eslint-disable no-new */

import ToolMarkup from 'html/tool.ejs';
import SearchMarkup from 'html/includes/_search.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import FlowContentContainer from 'containers/tool/tool-content.container';
import SankeyContainer from 'containers/tool/sankey.container';
import ColumnsSelectorContainer from 'react-components/tool/columns-selector.container';
import MapContextContainer from 'containers/tool/map-context.container';
import MapLegendContainer from 'containers/tool/map-legend.container';
import MapBasemapsContainer from 'containers/tool/map-basemaps.container';
import MapContainer from 'containers/tool/map.container';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import TitlebarContainer from 'containers/tool/titlebar.container';
import NodesTitlesContainer from 'containers/tool/nodesTitles.container';
import ModalContainer from 'containers/tool/story-modal.container';
import TooltipContainer from 'containers/shared/help-tooltip.container';

import {
  resizeSankeyTool,
  loadDisclaimerTool,
  loadStoryModalTool,
  setToolLoaders
} from 'react-components/tool/tool.thunks';
import MapDimensionsContainer from 'containers/tool/map-dimensions.container';

import 'styles/tool.scss';
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
    new SankeyContainer(store),
    new MapContainer(store),
    new MapDimensionsContainer(store),
    new MapContextContainer(store),
    new MapLegendContainer(store),
    new MapBasemapsContainer(store),
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
      <ColumnsSelectorContainer />
    </Provider>,
    document.getElementById('js-columns-selector-react')
  );

  evManager.addEventListener(window, 'resize', () => resizeSankeyTool(store.dispatch));
  document.querySelector('body').classList.add('-overflow-hidden');
};

export const unmount = () => {
  evManager.clearEventListeners();
  unmountComponentAtNode(document.getElementById('js-tool-nav-react'));
  unmountComponentAtNode(document.getElementById('js-columns-selector-react'));
  document.querySelector('body').classList.remove('-overflow-hidden');
  containers.forEach(container => container.remove());
};

// if (NODE_ENV_DEV === true) {
//   window.addEventListener('keydown', (event) => {
//     if (event.key === 'r' && event.ctrlKey) {
//       // reload without the hash
//       window.location.href = './flows';
//       // window.location.href = './flows?selectedNodesIds=[1915]';
//     }
//   });
// }
