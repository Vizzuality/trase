import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import AppReducer from 'reducers/app.reducer';
import ToolReducer from 'reducers/tool.reducer';
import DataReducer from 'reducers/data.reducer';
import analyticsMiddleware from 'analytics/tool.analytics.middleware';
import { toolUrlStateMiddleware } from 'utils/stateURL';
import router, { routeSubscriber } from './router';

const composeEnhancers =
  (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;


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
    applyMiddleware(analyticsMiddleware, thunk, router.middleware, toolUrlStateMiddleware)
  )
);

routeSubscriber(store);
