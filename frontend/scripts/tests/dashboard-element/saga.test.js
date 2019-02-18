import { fork, select } from 'redux-saga/effects';
import {
  getDashboardPanelSectionTabs,
  getDashboardPanelData,
  fetchDashboardPanelSearchResults,
  getMoreDashboardPanelData
} from 'react-components/dashboard-element/dashboard-element.fetch.saga';
import {
  fetchDashboardPanelInitialData,
  getSearchResults,
  onTabChange,
  onItemChange,
  onFilterClear,
  onPageChange
} from 'react-components/dashboard-element/dashboard-element.saga';

describe('fetchDashboardPanelInitialData', () => {
  const setActiveAction = tab => ({
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_PANEL',
    payload: { activePanelId: tab }
  });

  const stateCountries = {
    dashboardElement: {
      activePanelId: 'countries',
      countriesPanel: {
        activeItem: 'Brazil'
      }
    }
  };

  const stateCompanies = {
    dashboardElement: {
      activePanelId: 'companies'
    }
  };

  it('Calls getDashboardPanelSectionTabs tabs if the current active panel is companies', () => {
    const generator = fetchDashboardPanelInitialData(setActiveAction('any'));

    expect(generator.next().value).toEqual(select());
    expect(generator.next(stateCompanies).value).toEqual(
      fork(getDashboardPanelSectionTabs, stateCompanies.dashboardElement, 'any')
    );
  });

  it('Calls getDashboardPanelData and getDashboardPanelData for regions if selected panel is sources', () => {
    const sourcesGenerator = fetchDashboardPanelInitialData(setActiveAction('sources'));

    expect(sourcesGenerator.next().value).toEqual(select());
    expect(sourcesGenerator.next(stateCountries).value).toEqual(
      fork(getDashboardPanelData, stateCountries.dashboardElement, 'countries')
    );
    expect(sourcesGenerator.next(stateCountries).value).toEqual(
      fork(getDashboardPanelData, stateCountries.dashboardElement, 'sources')
    );
  });

  it('Calls getDashboardPanelData if selected panel is not companies nor sources', () => {
    const countriesGenerator = fetchDashboardPanelInitialData(setActiveAction('countries'));

    expect(countriesGenerator.next().value).toEqual(select());
    expect(countriesGenerator.next(stateCountries).value).toEqual(
      fork(getDashboardPanelData, stateCountries.dashboardElement, 'countries')
    );
  });
});

describe('getSearchResults', () => {
  const state = {
    dashboardElement: {
      activePanelId: 'countries',
      countriesPanel: {
        activeItem: 'Brazil'
      }
    }
  };
  const searchAction = {
    type: 'DASHBOARD_ELEMENT__GET_SEARCH_RESULTS',
    payload: { query: 'a' }
  };

  it('Calls fetchDashboardPanelSearchResults for the result of the search', () => {
    const generator = getSearchResults(searchAction);

    expect(generator.next().value).toEqual(select());
    expect(generator.next(state).value).toEqual(
      fork(fetchDashboardPanelSearchResults, state.dashboardElement, searchAction.payload.query)
    );
  });
});

describe('onTabChange', () => {
  const sameTabChangeState = {
    dashboardElement: {
      data: {
        sources: {
          3: {
            someData: 'data'
          }
        }
      },
      countriesPanel: {
        activeTab: {
          id: 3
        }
      },
      activePanelId: 'countries'
    }
  };
  const differentTabChangeState = {
    dashboardElement: {
      data: {
        sources: {
          4: {
            someData: 'data'
          }
        }
      },
      countriesPanel: {
        activeTab: {
          id: 3
        }
      },
      activeTab: {
        id: 3
      },
      activePanelId: 'countries'
    }
  };
  const searchAction = {
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH',
    payload: { panel: 'countries' }
  };

  it('Calls getDashboardPanelData if tab action is triggered', () => {
    const generator = onTabChange(searchAction);

    expect(generator.next().value).toEqual(select());
    expect(generator.next(differentTabChangeState).value).toEqual(
      fork(
        getDashboardPanelData,
        differentTabChangeState.dashboardElement,
        searchAction.payload.panel
      )
    );
  });
  const otherGenerator = onTabChange(searchAction);

  it('Does not call getDashboardPanelData if we already are in the target tab (we have data for it)', () => {
    expect(otherGenerator.next().value).toEqual(select());
    expect(otherGenerator.next(sameTabChangeState).value).not.toEqual(
      fork(getDashboardPanelData, sameTabChangeState.dashboardElement, searchAction.payload.panel)
    );
  });
});

describe('onItemChange', () => {
  const state = {
    dashboardElement: {
      data: {
        countries: {
          2: [{ id: 3, name: 'Brazil' }]
        },
        sources: {
          6: [{ name: 'data', id: 9 }]
        }
      },
      activePanelId: 'countries',
      countriesPanel: {
        activeTab: {
          id: 2
        }
      },
      sourcesPanel: {
        activeTab: {
          id: 6
        }
      }
    }
  };
  const otherState = {
    dashboardElement: {
      data: {
        sources: {
          6: [{ name: 'data', id: 6 }]
        }
      },
      sourcesPanel: {
        activeTab: {
          id: 6
        }
      }
    }
  };
  const changeToCountriesAction = {
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM',
    payload: { activeItem: { id: 5 }, panel: 'countries' }
  };
  const changeToSourcesAction = {
    type: 'DASHBOARD_ELEMENT__SET_ACTIVE_ITEM',
    payload: { activeItem: { id: 6 }, panel: 'sources' }
  };

  it('Recalculates getDashboardPanelSectionTabs if we select countries', () => {
    const countriesGenerator = onItemChange(changeToCountriesAction);

    expect(countriesGenerator.next().value).toEqual(select());
    expect(countriesGenerator.next(state).value).toEqual(
      fork(
        getDashboardPanelSectionTabs,
        state.dashboardElement,
        changeToCountriesAction.payload.panel
      )
    );
  });

  it('Recalculates getDashboardPanelData if the active item is missing', () => {
    const sourcesGenerator = onItemChange(changeToSourcesAction);

    expect(sourcesGenerator.next().value).toEqual(select());
    expect(sourcesGenerator.next(state).value).toEqual(
      fork(getDashboardPanelData, state.dashboardElement, changeToSourcesAction.payload.panel)
    );
  });

  it('Does not call getDashboardPanelData if we have the active item', () => {
    const otherSourcesGenerator = onItemChange(changeToSourcesAction);

    expect(otherSourcesGenerator.next().value).toEqual(select());
    expect(otherSourcesGenerator.next(otherState).value).not.toEqual(
      fork(getDashboardPanelData, otherState.dashboardElement, changeToSourcesAction.payload.panel)
    );
  });
});

describe('onFilterClear', () => {
  const state = {
    dashboardElement: {
      activePanelId: 'sources'
    }
  };
  const sourcesStateWithActiveItem = {
    dashboardElement: {
      activePanelId: 'sources',
      countriesPanel: {
        activeItem: { id: 5 }
      }
    }
  };
  const countriesState = {
    dashboardElement: {
      activePanelId: 'countries',
      countriesPanel: {
        activeItem: { id: 5 }
      }
    }
  };
  const clear = {
    type: 'DASHBOARD_ELEMENT__CLEAR_PANEL'
  };

  it('Calls getDashboardPanelData for countries if the active panel is sources', () => {
    const generator = onFilterClear(clear);
    expect(generator.next().value).toEqual(select());
    expect(generator.next(state).value).toEqual(
      fork(getDashboardPanelData, state.dashboardElement, 'countries')
    );
  });

  it('Calls getDashboardPanelData for countries and sources if the activeItem exists', () => {
    const generator = onFilterClear(clear);
    expect(generator.next().value).toEqual(select());
    expect(generator.next(sourcesStateWithActiveItem).value).toEqual(
      fork(getDashboardPanelData, sourcesStateWithActiveItem.dashboardElement, 'countries')
    );
    expect(generator.next(sourcesStateWithActiveItem).value).toEqual(
      fork(getDashboardPanelData, sourcesStateWithActiveItem.dashboardElement, 'sources')
    );
  });

  it('Calls getDashboardPanelData for countries with the active panel if is not sources', () => {
    const otherGenerator = onFilterClear(clear);
    expect(otherGenerator.next().value).toEqual(select());
    expect(otherGenerator.next(countriesState).value).toEqual(
      fork(getDashboardPanelData, countriesState.dashboardElement, 'countries')
    );
  });
});

describe('onPageChange', () => {
  const state = {
    dashboardElement: {
      activePanelId: 'countries',
      countriesPanel: {
        activeTab: 'BIOME'
      }
    }
  };
  const searchAction = {
    type: 'DASHBOARD_ELEMENT__SET_PANEL_PAGE',
    payload: { direction: 'LETS_GO' }
  };

  it('Calls getMoreDashboardPanelData to retrieve the next page of data when scrolling', () => {
    const generator = onPageChange(searchAction);

    expect(generator.next().value).toEqual(select());
    expect(generator.next(state).value).toEqual(
      fork(
        getMoreDashboardPanelData,
        state.dashboardElement,
        state.dashboardElement.activePanelId,
        state.dashboardElement.countriesPanel.activeTab,
        searchAction.payload.direction
      )
    );
  });
});
