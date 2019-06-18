/* eslint-disable global-require,import/no-extraneous-dependencies */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rangeTouch from 'rangetouch';
import analyticsMiddleware from 'analytics/middleware';
import * as appReducers from 'store';

import qs from 'query-string';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer';
import toolLinksInitialState from 'react-components/tool-links/tool-links.initial-state';
import * as ToolLinksUrlPropHandlers from 'react-components/tool-links/tool-links.serializers';
import appInitialState from 'reducers/app.initial-state';
import * as AppUrlPropHandlers from 'reducers/app.serializers';

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

const composeEnhancers =
  (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const reducers = combineReducers({
  ...appReducers,
  location: router.reducer
});

const params = qs.parse(window.location.search, { arrayFormat: 'bracket', parseNumbers: true });

const store = createStore(
  reducers,
  {
    app: deserialize({
      params,
      initialState: appInitialState,
      urlPropHandlers: AppUrlPropHandlers,
      props: ['selectedContext', 'selectedYears']
    }),
    toolLinks: deserialize({
      params,
      initialState: toolLinksInitialState,
      urlPropHandlers: ToolLinksUrlPropHandlers,
      props: ['selectedNodesIds', 'selectedColumnsIds', 'expandedNodesIds', 'detailedView']
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

routeSubscriber(store);
sagaMiddleware.run(rootSaga);
