export const DASHBOARD_ELEMENT__SET_PANEL_DATA = 'DASHBOARD_ELEMENT__SET_PANEL_DATA';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ID = 'DASHBOARD_ELEMENT__SET_ACTIVE_ID';
export const DASHBOARD_ELEMENT__CLEAR_PANEL = 'DASHBOARD_ELEMENT__CLEAR_PANEL';
export const DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR = 'DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR';
export const DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR =
  'DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR';

const data = {
  indicators: [
    { group: true, name: 'East Coast' },
    { name: 'tupac' },
    { name: 'kanye' },
    { name: 'eminem' },
    { group: true, name: 'West Coast' },
    { name: 'biggie' },
    { name: 'jay z' },
    { name: 'drake' }
  ],
  commodities: [
    { name: 'tupac' },
    { name: 'kanye' },
    { name: 'eminem' },
    { name: 'biggie' },
    { name: 'jay z' },
    { name: 'drake' }
  ],
  countries: [
    { name: 'tupac' },
    { name: 'kanye' },
    { name: 'eminem' },
    { name: 'biggie' }
    // { name: 'jay z' },
    // { name: 'drake' }
  ],
  companies: {
    importers: [{ name: 'Bunge' }, { name: 'Cargill' }, { name: 'ADM' }],
    exporters: [{ name: 'Bunge' }, { name: 'Cargill' }, { name: 'ADM' }]
  },
  jurisdictions: {
    biome: [
      { name: 'Amazonia' },
      { name: 'Cerrado' },
      { name: 'Mata Atlántica' },
      { name: 'Pampa' }
    ],
    state: [
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' },
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' },
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' },
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' },
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' },
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' },
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' },
      { name: 'Acre' },
      { name: 'Alagoas' },
      { name: 'Amapa' },
      { name: 'Amazonas' },
      { name: 'Cearra' },
      { name: 'Distrito Federal' },
      { name: 'Espirito Santo' },
      { name: 'Goias' },
      { name: 'Maranhao' },
      { name: 'Mato Grosso' },
      { name: 'Mato Grosso do Sul' }
    ]
  }
};

const dependencies = {
  indicators: ['indicators'],
  sourcing: ['countries', 'jurisdictions'],
  importing: ['jurisdictions'],
  companies: ['companies'],
  commodities: ['commodities']
};

export const getDashboardPanelData = panel => dispatch => {
  dependencies[panel].map(key =>
    setTimeout(
      () =>
        dispatch({
          type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
          payload: {
            key,
            data: data[key]
          }
        }),
      1000
    )
  );
};

export const setDashboardPanelActiveId = ({ type, active, panel, section }) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  payload: {
    type,
    panel,
    active,
    section
  }
});

export const clearDashaboardPanel = panel => ({
  type: DASHBOARD_ELEMENT__CLEAR_PANEL,
  payload: { panel }
});

export const addActiveIndicator = active => ({
  type: DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  payload: { active }
});

export const removeActiveIndicator = toRemove => ({
  type: DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
  payload: { toRemove }
});
