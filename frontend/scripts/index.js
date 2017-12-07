import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import router from './router';

import AppReducer from 'reducers/app.reducer';
import ToolReducer from 'reducers/tool.reducer';
import analyticsMiddleware from 'analytics/tool.analytics.middleware';
import { APP_DEFAULT_STATE, TOOL_DEFAULT_STATE } from 'constants';

const initialState = Object.assign({}, TOOL_DEFAULT_STATE, APP_DEFAULT_STATE);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  app: AppReducer,
  tool: ToolReducer,
  location: router.reducer
});

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(
    router.enhancer,
    applyMiddleware(analyticsMiddleware, thunk, router.middleware)
  )
);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./print.js', function() {
      // render();
  });
}

import(/* webpackChunkName: "tool" */ './pages/tool.page.js')
  .then((tool) => {
    tool.start(document.getElementById('app-root-container'), store);
  });