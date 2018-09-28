export const DASHBOARD_ELEMENT__SET_PANEL_DATA = 'DASHBOARD_ELEMENT__SET_PANEL_DATA';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ID = 'DASHBOARD_ELEMENT__SET_ACTIVE_ID';
export const DASHBOARD_ELEMENT__CLEAR_PANEL = 'DASHBOARD_ELEMENT__CLEAR_PANEL';
export const DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR = 'DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR';
export const DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR =
  'DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR';

const data = {
  indicators: [
    { group: true, name: 'East Coast' },
    {
      name: 'tupac',
      chartType: 'bar',
      url:
        'https://api.resourcewatch.org/v1/query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT%20fuel1%20as%20x,%20SUM(estimated_generation_gwh)%20as%20y%20FROM%20powerwatch_data_20180102%20%20GROUP%20BY%20%20x%20ORDER%20BY%20y%20desc%20LIMIT%20500&geostore=8de481b604a9d8c3f85d19846a976a3d'
    },
    { name: 'eminem', disabled: true },
    { group: true, name: 'West Coast' },
    { name: 'biggie', disabled: true },
    { group: true, name: 'Other' },
    { name: 'jay z', disabled: true },
    {
      name: 'kanye',
      chartType: 'bar',
      url:
        'https://api.resourcewatch.org/v1/query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT%20fuel1%20as%20x,%20SUM(estimated_generation_gwh)%20as%20y%20FROM%20powerwatch_data_20180102%20%20GROUP%20BY%20%20x%20ORDER%20BY%20y%20desc%20LIMIT%20500&geostore=8de481b604a9d8c3f85d19846a976a3d'
    },
    {
      name: 'drake',
      chartType: 'bar',
      url:
        'https://api.resourcewatch.org/v1/query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT%20fuel1%20as%20x,%20SUM(estimated_generation_gwh)%20as%20y%20FROM%20powerwatch_data_20180102%20%20GROUP%20BY%20%20x%20ORDER%20BY%20y%20desc%20LIMIT%20500&geostore=8de481b604a9d8c3f85d19846a976a3d'
    }
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
