class SagaRegistry {
  constructor() {
    this._emitChange = null;
    this._sagasMap = {};
  }

  getSagas() {
    return {
      ...this._sagasMap
    };
  }

  register(name, saga) {
    if (this._sagasMap[name]) {
      return;
    }

    this._sagasMap = {
      ...this._sagasMap,
      [name]: saga()
    };

    if (this._emitChange) {
      this._emitChange(this.getSagas());
    }
  }

  setChangeListener(listener) {
    this._emitChange = listener;
  }
}

const sagaRegistry = new SagaRegistry();

export default sagaRegistry;
