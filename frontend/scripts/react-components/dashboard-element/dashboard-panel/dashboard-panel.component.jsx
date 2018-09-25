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
    jurisdictions,
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
            activeJurisdictionTabId={sourcingPanel.activeJurisdictionTabId}
            activeJurisdictionValueId={sourcingPanel.activeJurisdictionItemId}
            searchJurisdictions={countries}
            tabs={tabs.jurisdictions}
            jurisdictions={jurisdictions}
            onSelectCountry={item =>
              setActiveId({
                type: 'item',
                active: item && item.name,
                section: 'country',
                panel: activePanelId
              })
            }
            onSelectJurisdictionTab={item =>
              setActiveId({
                type: 'tab',
                active: item,
                section: 'jurisdiction',
                panel: activePanelId
              })
            }
            onSelectJurisdictionValue={item =>
              setActiveId({
                type: 'item',
                active: item && item.name,
                section: 'jurisdiction',
                panel: activePanelId
              })
            }
          />
        )}
        {activePanelId === 'importing' && (
          <ImportingPanel
            searchJurisdictions={countries}
            jurisdictions={jurisdictions.state || []}
            onSelectJurisdictionValue={item =>
              setActiveId({
                active: item && item.name,
                type: 'item',
                section: 'jurisdiction',
                panel: activePanelId
              })
            }
            activeJurisdictionId={importingPanel.activeJurisdictionItemId}
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
  jurisdictions: PropTypes.object,
  tabs: PropTypes.array.isRequired,
  commoditiesPanel: PropTypes.array,
  panels: PropTypes.array.isRequired,
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
