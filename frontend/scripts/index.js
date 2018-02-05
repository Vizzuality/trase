import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import analyticsMiddleware from 'analytics/tool.analytics.middleware';
import { toolUrlStateMiddleware } from 'utils/stateURL';
import router from './router/router';
import routeSubscriber from './router/route-subscriber';
import * as appReducers from './store';

if (process.env.NODE_ENV !== 'production' && PERF_TEST) {
  import('react').then(React => {
    import('why-did-you-update').then(({ whyDidYouUpdate }) => whyDidYouUpdate(React));
  });
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
  composeEnhancers(
    router.enhancer,
    applyMiddleware(analyticsMiddleware, thunk, router.middleware, toolUrlStateMiddleware)
  )
);

routeSubscriber(store);
