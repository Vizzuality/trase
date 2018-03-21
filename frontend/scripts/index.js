import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rangeTouch from 'rangetouch';
import analyticsMiddleware from 'analytics/tool.analytics.middleware';
import { toolUrlStateMiddleware } from 'utils/stateURL';
import router from './router/router';
import routeSubscriber from './router/route-subscriber';
import * as appReducers from './store';

const middlewares = [analyticsMiddleware, thunk, router.middleware, toolUrlStateMiddleware];

window.liveSettings = TRANSIFEX_API_KEY && {
  api_key: TRANSIFEX_API_KEY,
  autocollect: true
};

// Rangetouch to fix <input type="range"> on touch devices (see https://rangetouch.com)
rangeTouch.set();

if (process.env.NODE_ENV !== 'production' && PERF_TEST) {
  import('react').then(React => {
    import('why-did-you-update').then(({ whyDidYouUpdate }) => whyDidYouUpdate(React));
  });
}

if (process.env.NODE_ENV !== 'production' && REDUX_LOGGER_ENABLED) {
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
