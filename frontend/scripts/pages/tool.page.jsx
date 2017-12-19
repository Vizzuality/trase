/* eslint-disable no-new */

import ToolMarkup from 'html/tool.ejs';
import SearchMarkup from 'html/includes/_search.ejs';
import NavtoolMarkup from 'html/includes/_navtool.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import FlowContentContainer from 'containers/tool/tool-content.container';
import SankeyContainer from 'containers/tool/sankey.container';
import ColumnsSelectorContainer from 'containers/tool/columns-selector-react.container';
import MapContextContainer from 'containers/tool/map-context.container';
import MapLegendContainer from 'containers/tool/map-legend.container';
import MapBasemapsContainer from 'containers/tool/map-basemaps.container';
import MapContainer from 'containers/tool/map.container';
import NavReactContainer from 'containers/tool/nav-tool-react.container';
import NavContainer from 'containers/tool/nav/nav-tool-navigation.container';
import TitlebarContainer from 'containers/tool/titlebar.container';
import NodesTitlesContainer from 'containers/tool/nodesTitles.container';
import SearchContainer from 'containers/shared/search-react.container';
import ModalContainer from 'containers/tool/story-modal.container';
import TooltipContainer from 'containers/shared/help-tooltip.container';

import { displayStoryModal, loadDisclaimer, resize } from 'actions/app.actions';
import { loadInitialData } from 'actions/tool.actions';
import MapDimensionsContainer from 'containers/tool/map-dimensions.container';

import 'styles/tool.scss';
import EventManager from 'utils/eventManager';

const evManager = new EventManager();

export const mount = (root, store) => {
  const { query = {} } = store.getState().location;

  root.innerHTML = ToolMarkup({
    search: SearchMarkup(),
    navtool: NavtoolMarkup(),
    feedback: FeedbackMarkup()
  });

  new FlowContentContainer(store);
  new SankeyContainer(store);
  new MapContainer(store);
  new MapDimensionsContainer(store);
  new MapContextContainer(store);
  new MapLegendContainer(store);
  new MapBasemapsContainer(store);
  new TitlebarContainer(store);
  new NodesTitlesContainer(store);
  new TooltipContainer(store);
  new ModalContainer(store);

  new NavContainer(store);
  render(
    <Provider store={store} >
      <NavReactContainer />
    </Provider >,
    document.getElementById('js-tool-nav-react')
  );
  render(
    <Provider store={store} >
      <ColumnsSelectorContainer />
    </Provider >,
    document.getElementById('js-columns-selector-react')
  );
  render(
    <Provider store={store} >
      <SearchContainer />
    </Provider >,
    document.getElementById('js-search-react')
  );

  store.dispatch(loadDisclaimer());
  store.dispatch(loadInitialData());
  if (query.story) {
    store.dispatch(displayStoryModal(query.story));
  }

  store.dispatch(resize());

  evManager.addEventListener(window, 'resize', () => store.dispatch(resize()));
  document.querySelector('body').classList.add('-overflow-hidden');
};

export const unmount = () => {
  evManager.clearEventListeners();
  document.querySelector('body').classList.remove('-overflow-hidden');
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
