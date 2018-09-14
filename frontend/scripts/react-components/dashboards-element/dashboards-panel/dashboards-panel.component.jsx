import React from 'react';
// import PropTypes from 'prop-types';
import BlockSwitch from 'react-components/shared/block-switch.component';
import SourcingPanel from 'react-components/dashboards-element/dashboards-panel/sourcing-panel.component';
import ImportingPanel from 'react-components/dashboards-element/dashboards-panel/importing-panel.component';

class DashboardsPanel extends React.PureComponent {
  state = {
    activePanelId: null,
    sourcingPanel: {
      activeCountryId: null,
      activeJurisdictionValueId: null,
      activeJurisdictionTabId: 'biome'
    },
    importingPanel: {
      activeJurisdictionId: null
    }
  };

  panels = [
    { id: 'sourcing', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];

  countries = [
    { name: 'tupac' },
    { name: 'kanye' },
    { name: 'eminem' },
    { name: 'biggie' }
    // { name: 'jay z' },
    // { name: 'drake' }
  ];

  jurisdictionTabs = ['biome', 'state'];

  jurisdictionValues = {
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
  };

  render() {
    const { activePanelId, sourcingPanel, importingPanel } = this.state;
    const dirtyBlocks = {
      sourcing: sourcingPanel.activeCountryId !== null,
      importing: importingPanel.activeJurisdictionId !== null
    };

    return (
      <div className="c-dashboard-panel">
        <div className="dashboard-panel-content">
          <h2 className="dashboard-panel-title title -center -light">
            Choose the options you want to add to the dashboard
          </h2>
          <BlockSwitch
            className="dashboard-panel-block-switch"
            blocks={this.panels}
            selectBlock={id => this.setState({ activePanelId: id })}
            activeBlockId={activePanelId}
            dirtyBlocks={dirtyBlocks}
          />
          {activePanelId === 'sourcing' && (
            <SourcingPanel
              activeCountryId={sourcingPanel.activeCountryId}
              activeJurisdictionTabId={sourcingPanel.activeJurisdictionTabId}
              activeJurisdictionValueId={sourcingPanel.activeJurisdictionValueId}
              searchJurisdictions={this.countries}
              tabs={this.jurisdictionTabs}
              jurisdictions={this.jurisdictionValues}
              onSelectCountry={country =>
                this.setState({
                  sourcingPanel: { ...sourcingPanel, activeCountryId: country.name }
                })
              }
              onSelectJurisdictionTab={tab =>
                this.setState({ sourcingPanel: { ...sourcingPanel, activeJurisdictionTabId: tab } })
              }
              onSelectJurisdictionValue={item =>
                this.setState({
                  sourcingPanel: { ...sourcingPanel, activeJurisdictionValueId: item.name }
                })
              }
            />
          )}
          {activePanelId === 'importing' && (
            <ImportingPanel
              searchJurisdictions={this.countries}
              jurisdictions={this.jurisdictionValues.state}
              onSelectJurisdictionValue={item =>
                this.setState({
                  importingPanel: { ...importingPanel, activeJurisdictionId: item.name }
                })
              }
              activeJurisdictionId={importingPanel.activeJurisdictionId}
            />
          )}
        </div>
        {Object.values(dirtyBlocks).some(b => b) && (
          <div className="dashboard-panel-footer">
            <p>Explore commodities produced in {sourcingPanel.activeCountryId}</p>
            <button className="c-button -pink -large">Continue</button>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardsPanel;
