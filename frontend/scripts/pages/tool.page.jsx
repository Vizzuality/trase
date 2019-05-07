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

import CookieBanner from 'react-components/shared/cookie-banner';
import MapContainer from 'react-components/tool/map/map.container';
import FlowContentContainer from 'react-components/tool/tool-content/tool-content.container';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.container';
import TooltipContainer from 'react-components/tool/help-tooltip/help-tooltip.container';
import ModalContainer from 'react-components/tool/story-modal/story-modal.container';
import TitlebarContainer from 'react-components/tool/titlebar/titlebar.container';
import ColumnsSelectorGroupContainer from 'react-components/tool/columns-selector-group/columns-selector-group.container';
import NodesTitlesContainer from 'react-components/tool/nodes-titles/nodes-titles.container';
import MapContextContainer from 'react-components/tool/map-context/map-context.container';
import MapBasemaps from 'react-components/tool/map-basemaps/map-basemaps.container';
import Sankey from 'react-components/tool/sankey/sankey.container';
import MapLegend from 'react-components/tool/map-legend/map-legend.container';

import {
  resizeSankeyTool,
  loadDisclaimerTool,
  setToolLoaders
} from 'react-components/tool/tool.thunks';
import MapDimensionsContainer from 'react-components/tool/map-dimensions/map-dimensions.container';

import EventManager from 'utils/eventManager';

const evManager = new EventManager();

export const mount = (root, store) => {
  root.innerHTML = ToolMarkup({
    search: SearchMarkup(),
    feedback: FeedbackMarkup()
  });

  // TODO remove this
  // In order to avoid adding loading states when not needed we check that the selectedContext
  // has indeed changed.
  const { app, toolLinks } = store.getState();
  if ((app.selectedContext && app.selectedContext.id) !== toolLinks.loadedFlowsContextId) {
    setToolLoaders(store.dispatch);
  }
  loadDisclaimerTool(store.dispatch);
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
      <CookieBanner />
    </Provider>,
    document.getElementById('cookie-banner')
  );

  render(
    <Provider store={store}>
      <>
        <MapContainer />
        <MapBasemaps />
        <MapDimensionsContainer />
        <FlowContentContainer />
        <MapLegend />
        <MapContextContainer />
        <NodesTitlesContainer />
        <Sankey />
        <TitlebarContainer />
        <TooltipContainer />
        <ModalContainer />
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
  unmountComponentAtNode(document.getElementById('cookie-banner'));
  unmountComponentAtNode(document.getElementById('js-react-vanilla-bridge-container'));
  document.querySelector('body').classList.remove('-overflow-hidden');
};
