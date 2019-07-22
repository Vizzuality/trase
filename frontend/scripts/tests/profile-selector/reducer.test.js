import reducer, {
  initialState
} from 'react-components/shared/profile-selector/profile-selector.reducer';
import { PROFILE_STEPS } from 'constants';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__SET_PANEL_DATA
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
