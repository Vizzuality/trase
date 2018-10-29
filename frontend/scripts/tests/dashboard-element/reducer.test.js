import reducer, {
  initialState
} from 'react-components/dashboard-element/dashboard-element.reducer';
import {
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE
} from 'react-components/dashboard-element/dashboard-element.actions';

describe(DASHBOARD_ELEMENT__SET_ACTIVE_PANEL, () => {
  const action = {
    type: DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
    payload: { activePanelId: 'sources' }
  };
  const expectedState = { ...initialState, activePanelId: 'sources' };

  it('sets correctly the activePanelId for the first time', () => {
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('sets the previous panel page number to initial value', () => {
    const state = {
      ...initialState,
      activePanelId: 'companies',
      companiesPanel: {
        ...initialState.companiesPanel,
        page: 4
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual(expectedState);
  });
});

test(DASHBOARD_ELEMENT__SET_PANEL_PAGE, () => {
  const action = {
    type: DASHBOARD_ELEMENT__SET_PANEL_PAGE,
    payload: { page: 4 }
  };
  const sourcesPanel = {
    ...initialState.sourcesPanel,
    activeTab: 2,
    activeItem: 23
  };
  const state = {
    ...initialState,
    sourcesPanel,
    activePanelId: 'sources'
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({ ...state, sourcesPanel: { ...sourcesPanel, page: 4 } });
});

describe(DASHBOARD_ELEMENT__SET_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];
  const someMeta = { type: 'some metadata' };

  it('adds data to an entity as an array', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: 'commodities',
        tab: null,
        data: someData,
        meta: someMeta,
        loading: false
      }
    };
    const state = { ...initialState, loading: true };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      data: { ...initialState.data, commodities: someData },
      meta: { ...initialState.meta, commodities: someMeta }
    });
  });

  it('adds data to an entity as an object', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: {
        key: 'sources',
        tab: 1,
        loading: false,
        meta: someMeta,
        data: someData
      }
    };
    const state = { ...initialState, loading: true };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      data: {
        ...initialState.data,
        sources: { 1: someData }
      },
      meta: { ...initialState.meta, sources: someMeta }
    });
  });

  it('clears data from an array entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: { key: 'commodities', tab: null, data: null, meta: null, loading: true }
    };
    const state = {
      ...initialState,
      loading: false,
      data: {
        ...initialState.data,
        countries: someData,
        commodities: someData
      },
      meta: { ...initialState.meta, commodities: someMeta }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: true,
      data: {
        ...state.data,
        commodities: initialState.data.commodities
      },
      meta: {
        ...initialState.meta,
        commodities: null
      }
    });
  });

  it('clears data from an object entity', () => {
    const action = {
      type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
      payload: { key: 'sources', tab: null, data: null, meta: null, loading: true }
    };
    const state = {
      ...initialState,
      loading: false,
      data: {
        ...initialState.data,
        countries: someData,
        sources: { 1: someData, 2: someData }
      },
      meta: { ...initialState.meta, sources: someMeta }
    };

    const expected = {
      ...initialState,
      loading: true,
      data: {
        ...state.data,
        sources: initialState.data.sources
      },
      meta: {
        ...initialState.meta,
        sources: null
      }
    };

    const newState = reducer(state, action);
    expect(newState).toEqual(expected);

    const tabReset = reducer(state, { ...action, payload: { ...action.payload, tab: 1 } });
    expect(tabReset).toEqual({
      ...expected,
      data: { ...expected.data, sources: { 1: null, 2: someData } }
    });
  });
});
