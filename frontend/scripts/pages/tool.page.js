import { Provider } from 'preact-redux';
import { h, render } from 'preact';

import ToolMarkup from 'html/tool.ejs';
import SearchMarkup from 'html/includes/_search.ejs';
import NavtoolMarkup from 'html/includes/_navtool.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import FlowContentContainer from 'containers/tool/tool-content.container';
import SankeyContainer from 'containers/tool/sankey.container';
import ColumnsSelectorContainer from 'containers/tool/columns-selector-react.container';
import MapDimensionsContainer from 'containers/tool/map-dimensions.container.js';
import MapContextContainer from 'containers/tool/map-context.container';
import MapLegendContainer from 'containers/tool/map-legend.container';
import MapBasemapsContainer from 'containers/tool/map-basemaps.container';
import MapContainer from 'containers/tool/map.container';
import NavContainer from 'containers/tool/nav-tool-react.container';
import NavComponent from 'components/tool/nav-tool.component';
import TitlebarContainer from 'containers/tool/titlebar.container';
import NodesTitlesContainer from 'containers/tool/nodesTitles.container';
import SearchContainer from 'containers/shared/search-react.container';
import ModalContainer from 'containers/tool/story-modal.container';
import TooltipContainer from 'containers/shared/help-tooltip.container';

import { resize, loadDisclaimer } from 'actions/app.actions';
import { loadInitialData } from 'actions/tool.actions';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/tool/map/map-sidebar.scss';
import 'styles/layouts/l-tool.scss';

export const renderPage = (root, store) => {
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

  new NavComponent();
  render(
    <Provider store={store}>
      <NavContainer />
    </Provider>,
    document.getElementById('js-tool-nav-react')
  );
  render(
    <Provider store={store}>
      <ColumnsSelectorContainer />
    </Provider>,
    document.getElementById('js-columns-selector-react')
  );
  render(
    <Provider store={store}>
      <SearchContainer />
    </Provider>,
    document.getElementById('js-search-react')
  );



  store.dispatch(loadDisclaimer());
  store.dispatch(loadInitialData());
  store.dispatch(resize());

  window.addEventListener('resize', () => {
    store.dispatch(resize());
  });
};

// if (objParams.story) {
//   // TODO display loading state while loading service
//
//   const storyId = objParams.story;
//
//   fetch(`${getURLFromParams(GET_SITE_DIVE)}/${storyId}`)
//     .then(resp => resp.text())
//     .then(resp => JSON.parse(resp))
//     .then(modalParams => {
//       Object.assign(APP_DEFAULT_STATE.app, {
//         modal: {
//           visibility: true,
//           modalParams: modalParams.data
//         }
//       });
//
//       start();
//     })
//     .catch(() => {
//       start();
//     });
//
// } else {
//   start();
// }

// if (NODE_ENV_DEV === true) {
//   window.addEventListener('keydown', (event) => {
//     if (event.key === 'r' && event.ctrlKey) {
//       // reload without the hash
//       window.location.href = './flows.html';
//       // window.location.href = './flows.html?selectedNodesIds=[1915]';
//     }
//   });
// }
