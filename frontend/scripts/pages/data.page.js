import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import DataContentContainer from 'containers/data/data-content.container';
import Nav from 'components/shared/nav.component.js';
import DataReducer from 'reducers/data.reducer';
import { loadContext } from 'actions/data.actions';
import { DATA_DEFAULT_STATE } from 'constants';
import analyticsMiddleware from 'analytics/data.analytics.middleware';

import 'styles/data.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/modal.scss';


const start = (initialState) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  var store = createStore(
    combineReducers({
      data: DataReducer
    }),
    initialState,
    composeEnhancers(
      applyMiddleware(analyticsMiddleware, thunk)
    )
  );

  new DataContentContainer(store);

  store.dispatch(loadContext());
};

const globalState = Object.assign({}, DATA_DEFAULT_STATE);

start(globalState);

new Nav();
