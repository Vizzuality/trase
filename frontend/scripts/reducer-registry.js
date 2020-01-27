import { combineReducers } from 'redux';
import * as initialState from './initial-state';

// As seen in http://nicolasgallagher.com/redux-modules-and-code-splitting/
class ReducerRegistry {
  constructor(intialState = {}, blacklist = []) {
    this._emitChange = null;
    this._reducers = {};
    this._initialState = intialState;
    this._blacklist = blacklist;
  }

  getReducers() {
    return { ...this._reducers };
  }

  getCombinedReducer() {
    const reducers = this.getReducers();
    const reducerNames = Object.keys(reducers);
    if (NODE_ENV_DEV) {
      reducerNames.forEach(name => {
        if (!this._blacklist.includes(name) && typeof this._initialState[name] === 'undefined') {
          throw new Error(
            `You forgot to declare ${name} reducer initial state in initial-state.js`
          );
        }
      });
    }

    Object.entries(this._initialState).forEach(([name, initial]) => {
      if (reducerNames.includes(name) === false) {
        reducers[name] = (state = initial) => state;
      }
    });
    return combineReducers(reducers);
  }

  register(name, reducer) {
    this._reducers = { ...this._reducers, [name]: reducer };
    if (this._emitChange) {
      this._emitChange(this.getCombinedReducer());
    }
  }

  setChangeListener(listener) {
    this._emitChange = listener;
  }
}

const reducerRegistry = new ReducerRegistry(initialState, ['location']);
export default reducerRegistry;
