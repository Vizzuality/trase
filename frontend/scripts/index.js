import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import router from './router';

import AppReducer from 'reducers/app.reducer';
import ToolReducer from 'reducers/tool.reducer';
import DataReducer from 'reducers/data.reducer';

import analyticsMiddleware from 'analytics/tool.analytics.middleware';

const composeEnhancers = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
  app: AppReducer,
  tool: ToolReducer,
  data: DataReducer,
  location: router.reducer
});

const store = createStore(
  reducers,
  undefined,
  composeEnhancers(
    router.enhancer,
    applyMiddleware(analyticsMiddleware, thunk, router.middleware)
  )
);

const { routesMap, type } = store.getState().location;

import(/* webpackChunkName: "page" */ `./pages/${routesMap[type].page}.page.js`)
  .then((page) => {
    page.renderPage(document.getElementById('app-root-container'), store);
  });

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept(`./pages/${routesMap[type].page}.page.js`, function() {
    // render();
  });
}