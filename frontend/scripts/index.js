/* eslint-disable global-require,import/no-extraneous-dependencies */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import parseURL from 'utils/parseURL';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rangeTouch from 'rangetouch';
import analyticsMiddleware from 'analytics/middleware';
import * as appReducers from 'store';

import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import toolLinksInitialState from 'react-components/tool-links/tool-links.initial-state';
import * as ToolLinksUrlPropHandlers from 'react-components/tool-links/tool-links.serializers';
import appInitialState from 'reducers/app.initial-state';
import toolLayersInitialState from 'react-components/tool-layers/tool-layers.initial-state';
import * as ToolLayersUrlPropHandlers from 'react-components/tool-layers/tool-layers.serializers';
import dashboardElementInitialState from 'react-components/dashboard-element/dashboard-element.initial-state';
import * as DashboardElementUrlPropHandlers from 'react-components/dashboard-element/dashboard-element.serializers';
import router from './router/router';
import routeSubscriber from './router/route-subscriber';
import { register, unregister } from './worker';
import { rootSaga } from './sagas';
import { setTransifexLanguages } from './actions/app.actions';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';

const sagaMiddleware = createSagaMiddleware();

// analytics middleware has to be after router.middleware
const middlewares = [thunk, sagaMiddleware, router.middleware, analyticsMiddleware];

window.liveSettings = TRANSIFEX_API_KEY && {
  api_key: TRANSIFEX_API_KEY,
  autocollect: true
};

// Rangetouch to fix <input type="range"> on touch devices (see https://rangetouch.com)
rangeTouch.set();

if (USE_SERVICE_WORKER) {
  register();
} else {
  unregister();
}

if (REDUX_LOGGER_ENABLED) {
  const { createLogger } = require('redux-logger');

  const loggerMiddleware = createLogger({
    collapsed: true
  });

  middlewares.push(loggerMiddleware);
}

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    maxAge: 10,
    stateSanitizer: state => ({
      ...state,
      toolLinks: {
        ...state.toolLinks,
        data: 'NOT_SERIALIZED'
      },
      toolLayers: {
        ...state.toolLayers,
        data: 'NOT_SERIALIZED'
      },
      dashboardElement: {
        ...state.dashboardElement,
        data: 'NOT_SERIALIZED'
      },
      widgets: 'NOT_SERIALIZED',
      staticContent: 'NOT_SERIALIZED'
    })
  });

const composeEnhancers = (process.env.NODE_ENV === 'development' && reduxDevTools) || compose;

const reducers = combineReducers({
  ...appReducers,
  location: router.reducer
});

const params = parseURL(window.location.search);
const store = createStore(
  reducers,
  {
    app: deserialize({
      params,
      state: appInitialState,
      props: ['selectedContextId', 'selectedYears']
    }),
    toolLinks: deserialize({
      params,
      state: toolLinksInitialState,
      urlPropHandlers: ToolLinksUrlPropHandlers,
      props: [
        'selectedNodesIds',
        'selectedColumnsIds',
        'expandedNodesIds',
        'detailedView',
        'selectedResizeBy',
        'selectedRecolorBy',
        'extraColumnId',
        ENABLE_REDESIGN_PAGES ? 'extraColumnNodeId' : 'selectedBiomeFilterName'
      ]
    }),
    toolLayers: deserialize({
      params,
      state: toolLayersInitialState,
      urlPropHandlers: ToolLayersUrlPropHandlers,
      props: [
        'mapView',
        'toolLayout',
        'selectedBasemap',
        'selectedMapContextualLayers',
        'selectedMapDimensions'
      ]
    }),
    dashboardElement: deserialize({
      params,
      state: dashboardElementInitialState,
      urlPropHandlers: DashboardElementUrlPropHandlers,
      props: [
        'sources',
        'companies',
        'destinations',
        'selectedYears',
        'selectedResizeBy',
        'selectedRecolorBy',
        'selectedCountryId',
        'selectedCommodityId'
      ]
    })
  },
  composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
);

window.onTransifexLoad = () => {
  if (window.Transifex?.live) {
    window.Transifex.live.onFetchLanguages(languages =>
      store.dispatch(setTransifexLanguages(languages))
    );
  }
};

sagaMiddleware.run(rootSaga);
routeSubscriber(store);
router.initialDispatch();
