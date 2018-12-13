/* eslint-disable global-require,import/no-extraneous-dependencies */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rangeTouch from 'rangetouch';
import analyticsMiddleware from 'analytics/middleware';
import { toolUrlStateMiddleware } from 'utils/stateURL';
import * as appReducers from 'store';
import router from './router/router';
import routeSubscriber from './router/route-subscriber';
import { register, unregister } from './worker';
import { rootSaga } from './sagas';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';

const sagaMiddleware = createSagaMiddleware();

// analytics middleware has to be after router.middleware
const middlewares = [
  thunk,
  sagaMiddleware,
  router.middleware,
  toolUrlStateMiddleware,
  analyticsMiddleware
];

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

if (process.env.NODE_ENV !== 'production' && PERF_TEST) {
  const React = require('react');
  const { whyDidYouUpdate } = require('why-did-you-update');

  whyDidYouUpdate(React);
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

const store = createStore(
  reducers,
  undefined,
  composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
);

routeSubscriber(store);
sagaMiddleware.run(rootSaga);
