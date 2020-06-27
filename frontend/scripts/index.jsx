/* eslint-disable global-require,import/no-extraneous-dependencies */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import promiseFinally from 'promise.prototype.finally';
import parseURL from 'utils/parseURL';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import analyticsMiddleware from 'analytics/middleware';
import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';

import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import toolLinksInitialState from 'react-components/tool-links/tool-links.initial-state';
import toolLinksSerialization from 'react-components/tool-links/tool-links.serializers';
import appInitialState from 'app/app.initial-state';
import appSerialization from 'app/app.serializers';
import { appActions } from 'app/app.register';
import App from 'app/app.component';
import toolLayersInitialState from 'react-components/tool-layers/tool-layers.initial-state';
import toolLayersSerialization from 'react-components/tool-layers/tool-layers.serializers';
import dashboardElementInitialState from 'react-components/dashboard-element/dashboard-element.initial-state';
import dashboardElementSerialization from 'react-components/dashboard-element/dashboard-element.serializers';
import nodesPanelInitialState from 'react-components/nodes-panel/nodes-panel.initial-state';
import nodesPanelSerialization from 'react-components/nodes-panel/nodes-panel.serializers';
import router from './router/router';
import { register, unregister } from './worker';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';

promiseFinally.shim();

const sagaMiddleware = createSagaMiddleware();

// analytics middleware has to be after router.middleware
const middlewares = [thunk, sagaMiddleware, router.middleware, analyticsMiddleware];

window.liveSettings = TRANSIFEX_API_KEY && {
  api_key: TRANSIFEX_API_KEY,
  autocollect: true
};

// test for ie11 and googlebot
if (
  !(!window.ActiveXObject && 'ActiveXObject' in window) &&
  !/bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent)
) {
  // Rangetouch to fix <input type="range"> on touch devices (see https://rangetouch.com)
  import(`rangetouch`)
    .then(module => module.default)
    .then(RangeTouch => new RangeTouch('input[type="range"]'));
}

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

reducerRegistry.register('location', router.reducer);

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    maxAge: 200,
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
      widgets: 'NOT_SERIALIZED',
      staticContent: 'NOT_SERIALIZED'
    })
  });

const composeEnhancers = (process.env.NODE_ENV === 'development' && reduxDevTools) || compose;

const combinedReducers = reducerRegistry.getCombinedReducer();

const params = parseURL(window.location.search);

// easter egg :P
if (typeof window !== 'undefined') {
  window._TRASE_CANDY_SANKEY = params.candyMode;
}

const store = createStore(
  combinedReducers,
  {
    app: deserialize({
      params,
      state: appInitialState,
      ...appSerialization
    }),
    toolLinks: deserialize({
      params,
      state: toolLinksInitialState,
      ...toolLinksSerialization
    }),
    toolLayers: deserialize({
      params,
      state: toolLayersInitialState,
      ...toolLayersSerialization
    }),
    dashboardElement: deserialize({
      params,
      state: dashboardElementInitialState,
      ...dashboardElementSerialization
    }),
    nodesPanel: deserialize({
      params,
      state: nodesPanelInitialState,
      ...nodesPanelSerialization
    })
  },
  composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
);

reducerRegistry.setChangeListener(asyncCombinedReducers =>
  store.replaceReducer(asyncCombinedReducers)
);

window.onTransifexLoad = () => {
  if (window.Transifex?.live) {
    window.Transifex.live.onFetchLanguages(languages =>
      store.dispatch(appActions.setTransifexLanguages(languages))
    );
  }
};

sagaRegistry.setChangeListener(sagas => {
  function* runSagas() {
    yield all(sagas);
  }
  sagaMiddleware.run(runSagas);
  store.dispatch({ type: appActions.APP__SAGA_REGISTERED });
});

function* startSagas() {
  yield all(sagaRegistry.getSagas());
}
sagaMiddleware.run(startSagas);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app-root-container')
);

router.initialDispatch();
