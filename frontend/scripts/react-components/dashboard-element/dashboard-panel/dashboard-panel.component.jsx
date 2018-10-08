import React from 'react';
import PropTypes from 'prop-types';
import BlockSwitch from 'react-components/shared/block-switch.component';
import SourcingPanel from 'react-components/dashboard-element/dashboard-panel/sourcing-panel.component';
import ImportingPanel from 'react-components/dashboard-element/dashboard-panel/importing-panel.component';
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
    sourcingPanel,
    importingPanel,
    companiesPanel,
    clearActiveId,
    setActiveId,
    sources,
    destinations,
    countries,
    companies,
    commodities,
    onContinue,
    dynamicSentenceParts,
    commoditiesPanel
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
        {activePanelId === 'sourcing' && (
          <SourcingPanel
            activeCountryId={sourcingPanel.activeCountryItemId}
            activeSourceTabId={sourcingPanel.activeSourceTabId}
            activeSourceValueId={sourcingPanel.activeSourceItemId}
            searchSources={countries}
            tabs={tabs.sources}
            sources={sources}
            onSelectCountry={item =>
              setActiveId({
                type: 'item',
                active: item && item.name,
                section: 'country',
                panel: activePanelId
              })
            }
            onSelectSourceTab={item =>
              setActiveId({
                type: 'tab',
                active: item,
                section: 'source',
                panel: activePanelId
              })
            }
            onSelectSourceValue={item =>
              setActiveId({
                type: 'item',
                active: item && item.name,
                section: 'source',
                panel: activePanelId
              })
            }
          />
        )}
        {activePanelId === 'importing' && (
          <ImportingPanel
            searchDestinations={destinations}
            destinations={destinations || []}
            onSelectDestinationValue={item =>
              setActiveId({
                active: item && item.name,
                type: 'item',
                section: 'destination',
                panel: activePanelId
              })
            }
            activeDestinationId={importingPanel.activeDestinationItemId}
          />
        )}
        {activePanelId === 'companies' && (
          <CompaniesPanel
            tabs={tabs.companies}
            searchCompanies={[]}
            companies={companies}
            onSelectNodeTypeTab={item =>
              setActiveId({
                type: 'tab',
                active: item,
                section: 'nodeType',
                panel: activePanelId
              })
            }
            onSelectCompany={item =>
              setActiveId({
                type: 'item',
                active: item && item.name,
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
            searchCommodities={commodities}
            commodities={commodities}
            onSelectCommodity={item =>
              setActiveId({
                type: 'item',
                active: item && item.name,
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
  tabs: PropTypes.object,
  commoditiesPanel: PropTypes.object,
  panels: PropTypes.array.isRequired,
  destinations: PropTypes.array.isRequired,
  onContinue: PropTypes.func.isRequired,
  dynamicSentenceParts: PropTypes.array,
  setActiveId: PropTypes.func.isRequired,
  clearActiveId: PropTypes.func.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  sourcingPanel: PropTypes.object.isRequired,
  importingPanel: PropTypes.object.isRequired,
  companiesPanel: PropTypes.object.isRequired
};

export default DashboardPanel;
