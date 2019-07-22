import reducer, {
  initialState
} from 'react-components/shared/profile-selector/profile-selector.reducer';
import { PROFILE_STEPS } from 'constants';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_MORE_PANEL_DATA
} from 'react-components/shared/profile-selector/profile-selector.actions';

const activeTypePanel = panel => ({ types: { activeItems: { type: panel } } });

describe(PROFILES__SET_ACTIVE_STEP, () => {
  const action = {
    type: PROFILES__SET_ACTIVE_STEP,
    payload: { activeStep: 'types' }
  };
  const expectedState = { ...initialState, activeStep: 'types' };

  it('sets correctly the activeStep', () => {
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });
});

describe(PROFILES__SET_PANEL_PAGE, () => {
  const action = {
    type: PROFILES__SET_PANEL_PAGE,
    payload: { page: 4 }
  };
  const sourcesPanel = {
    ...initialState.panels.sources,
    activeTab: 2,
    activeItems: [23]
  };
  const state = {
    ...initialState,
    panels: {
      ...activeTypePanel('sources'),
      sources: sourcesPanel
    },
    activeStep: PROFILE_STEPS.profiles
  };
  const newState = reducer(state, action);
  expect(newState).toEqual({
    ...state,
    panels: {
      ...activeTypePanel('sources'),
      sources: { ...sourcesPanel, page: 4 }
    }
  });
});

describe(PROFILES__SET_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];

  it('adds data to a panel without tabs', () => {
    const action = {
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName: 'commodities',
        tab: null,
        data: someData,
        loading: false
      }
    };
    const state = { ...initialState, loading: true };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      data: { ...initialState.data, commodities: someData }
    });
  });

  it('adds data to a panel with tabs', () => {
    const action = {
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName: 'sources',
        tab: 3,
        data: someData,
        loading: false
      }
    };
    const state = { ...initialState, loading: true };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      data: { ...initialState.data, sources: { [action.payload.tab]: someData } }
    });
  });

  it('adds data to companies panel', () => {
    const action = {
      type: PROFILES__SET_PANEL_DATA,
      payload: {
        panelName: 'companies',
        tab: 3,
        data: someData,
        loading: false
      }
    };
    const countriesPanel = {
      countries: {
        ...initialState.panels.countries,
        activeItems: [
          {
            id: 1,
            name: 'BRAZIL'
          }
        ]
      }
    };
    const state = {
      ...initialState,
      panels: {
        ...initialState.panels,
        ...countriesPanel
      },
      loading: true
    };

    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      panels: {
        ...initialState.panels,
        ...countriesPanel
      },
      data: {
        ...initialState.data,
        companies: {
          [state.panels.countries.activeItems[0].id]: { [action.payload.tab]: someData }
        }
      }
    });
  });
});

describe(PROFILES__SET_MORE_PANEL_DATA, () => {
  const someData = [{ id: 0, name: 'name0' }, { id: 1, name: 'name1' }];
  const moreData = [{ id: 0, name: 'Whatever' }];

  it('adds more data to a panel', () => {
    const action = {
      type: PROFILES__SET_MORE_PANEL_DATA,
      payload: {
        tab: null,
        data: moreData,
        key: 'commodities',
        direction: 'forward'
      }
    };
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        commodities: someData
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      data: {
        ...state.data,
        commodities: [...someData, ...moreData]
      }
    });
  });

  it('adds more data to companies panel', () => {
    const action = {
      type: PROFILES__SET_MORE_PANEL_DATA,
      payload: {
        tab: 3,
        data: moreData,
        key: 'companies',
        direction: 'forward'
      }
    };

    const countriesPanel = {
      countries: {
        ...initialState.panels.countries,
        activeItems: [
          {
            id: 1,
            name: 'BRAZIL'
          }
        ]
      }
    };
    const state = {
      ...initialState,
      panels: {
        ...initialState.panels,
        ...countriesPanel
      },
      data: {
        ...initialState.data,
        companies: { 1: { 3: someData } }
      }
    };
    const newState = reducer(state, action);
    const selectedCountryId = state.panels.countries.activeItems[0].id;
    const moreCountryData = {
      [selectedCountryId]: {
        ...state.data.companies[selectedCountryId],
        [action.payload.tab]: [...someData, ...moreData]
      }
    };
    expect(newState).toEqual({
      ...state,
      panels: {
        ...initialState.panels,
        ...countriesPanel
      },
      data: {
        ...state.data,
        companies: moreCountryData
      }
    });
  });

  it('resets the page number when theres no new data', () => {
    const action = {
      type: PROFILES__SET_MORE_PANEL_DATA,
      payload: {
        tab: 1,
        data: [],
        key: 'commodities',
        direction: 'forward'
      }
    };
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        commodities: someData
      },
      panels: {
        commodities: {
          ...initialState.panels.commodities,
          page: 3
        }
      }
    };
    const newState = reducer(state, action);
    expect(newState).toEqual({
      ...state,
      panels: {
        commodities: {
          ...state.panels.commodities,
          page: 2
        }
      }
    });
  });
});
