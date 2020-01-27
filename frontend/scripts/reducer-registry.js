import { combineReducers } from 'redux';
import * as initialState from './initial-state';

// As seen in http://nicolasgallagher.com/redux-modules-and-code-splitting/
class ReducerRegistry {
  constructor(intialState = {}) {
    this._emitChange = null;
    this._reducers = {};
    this._initialState = intialState;
  }

  getReducers() {
    return { ...this._reducers };
  }

  getCombinedReducer() {
    const reducers = this.getReducers();
    const reducerNames = Object.keys(reducers);
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

const reducerRegistry = new ReducerRegistry(initialState);
export default reducerRegistry;
