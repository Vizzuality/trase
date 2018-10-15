import React from 'react';
import PropTypes from 'prop-types';
import BlockSwitch from 'react-components/shared/block-switch.component';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import DestinationsPanel from 'react-components/dashboard-element/dashboard-panel/destinations-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';
import DashboardModalFooter from 'react-components/dashboard-element/dahsboard-modal-footer.component';

function DashboardPanel(props) {
  const {
    tabs,
    panels,
    dirtyBlocks,
    activePanelId,
    setActivePanel,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    clearActiveId,
    setActiveId,
    sources,
    destinations,
    countries,
    companies,
    commodities,
    onContinue,
    commoditiesPanel,
    dynamicSentenceParts,
    getDashboardPanelData
  } = props;
  return (
    <div className="c-dashboard-panel">
      <div className="dashboard-panel-content">
        <h2 className="dashboard-panel-title title -center -light">
          Choose the options you want to add to the dashboard
        </h2>
        <BlockSwitch
          className="dashboard-panel-block-switch"
          blocks={panels}
          selectBlock={setActivePanel}
          activeBlockId={activePanelId}
          dirtyBlocks={dirtyBlocks}
        />
        {activePanelId === 'sources' && (
          <SourcesPanel
            clearItems={() => clearActiveId(activePanelId)}
            getCountriesData={options => getDashboardPanelData('countries', null, options)}
            getSourcesData={options =>
              getDashboardPanelData(activePanelId, sourcesPanel.activeSourceTabId, options)
            }
            activeCountryItemId={sourcesPanel.activeCountryItemId}
            activeSourceTabId={sourcesPanel.activeSourceTabId}
            activeSourceItemId={sourcesPanel.activeSourceItemId}
            searchSources={countries}
            tabs={tabs}
            sources={sources}
            onSelectCountry={item =>
              setActiveId({
                type: 'item',
                active: item && item.id,
                section: 'country',
                panel: activePanelId
              })
            }
            onSelectSourceTab={item =>
              setActiveId({
                type: 'tab',
                active: item.id,
                section: 'source',
                panel: activePanelId
              })
            }
            onSelectSourceValue={item =>
              setActiveId({
                type: 'item',
                active: item && item.id,
                section: 'source',
                panel: activePanelId
              })
            }
          />
        )}
        {activePanelId === 'destinations' && (
          <DestinationsPanel
            getData={options => getDashboardPanelData(activePanelId, null, options)}
            searchDestinations={destinations}
            destinations={destinations || []}
            onSelectDestinationValue={item =>
              setActiveId({
                active: item && item.id,
                type: 'item',
                section: 'destination',
                panel: activePanelId
              })
            }
            activeDestinationId={destinationsPanel.activeDestinationItemId}
          />
        )}
        {activePanelId === 'companies' && (
          <CompaniesPanel
            tabs={tabs}
            getCompaniesData={options =>
              getDashboardPanelData(activePanelId, companiesPanel.activeNodeTypeTabId, options)
            }
            searchCompanies={[]}
            companies={companies[companiesPanel.activeNodeTypeTabId]}
            onSelectNodeTypeTab={item =>
              setActiveId({
                type: 'tab',
                active: item && item.id,
                section: 'nodeType',
                panel: activePanelId
              })
            }
            onSelectCompany={item =>
              setActiveId({
                type: 'item',
                active: item && item.id,
                section: 'company',
                panel: activePanelId
              })
            }
            activeNodeTypeTabId={companiesPanel.activeNodeTypeTabId}
            activeCompanyId={companiesPanel.activeCompanyItemId}
          />
        )}
        {activePanelId === 'commodities' && (
          <CommoditiesPanel
            getData={options => getDashboardPanelData(activePanelId, null, options)}
            searchCommodities={commodities}
            commodities={commodities}
            onSelectCommodity={item =>
              setActiveId({
                type: 'item',
                active: item && item.id,
                section: 'commodity',
                panel: activePanelId
              })
            }
            activeCommodityId={commoditiesPanel.activeCommodityItemId}
          />
        )}
      </div>
      {dynamicSentenceParts && (
        <DashboardModalFooter
          onContinue={onContinue}
          clearItem={clearActiveId}
          dynamicSentenceParts={dynamicSentenceParts}
        />
      )}
    </div>
  );
}

DashboardPanel.propTypes = {
  countries: PropTypes.array,
  companies: PropTypes.object,
  commodities: PropTypes.array,
  dirtyBlocks: PropTypes.object,
  activePanelId: PropTypes.string,
  sources: PropTypes.object,
  tabs: PropTypes.array,
  commoditiesPanel: PropTypes.object,
  panels: PropTypes.array.isRequired,
  destinations: PropTypes.array.isRequired,
  onContinue: PropTypes.func.isRequired,
  dynamicSentenceParts: PropTypes.array,
  setActiveId: PropTypes.func.isRequired,
  clearActiveId: PropTypes.func.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  sourcesPanel: PropTypes.object.isRequired,
  destinationsPanel: PropTypes.object.isRequired,
  companiesPanel: PropTypes.object.isRequired,
  getDashboardPanelData: PropTypes.func.isRequired
};

export default DashboardPanel;
