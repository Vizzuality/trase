import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlockSwitch from 'react-components/shared/block-switch/block-switch.component';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import DestinationsPanel from 'react-components/dashboard-element/dashboard-panel/destinations-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import CommoditiesPanel from 'react-components/dashboard-element/dashboard-panel/commodities-panel.component';
import DashboardModalFooter from 'react-components/dashboard-element/dashboard-modal-footer/dashboard-modal-footer.component';
import addApostrophe from 'utils/addApostrophe';

import 'scripts/react-components/dashboard-element/dashboard-panel/dashboard-panel.scss';

class DashboardPanel extends Component {
  containerRef = React.createRef();

  getSnapshotBeforeUpdate() {
    const container = this.containerRef.current;
    if (container && container.scrollTop > 0) {
      return container.scrollHeight - container.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const container = this.containerRef.current;
    if (snapshot && container) {
      container.scrollTop = container.scrollHeight - snapshot;
    }
  }

  static countryNameNodeTypeRenderer(node) {
    return `${node.countryName + addApostrophe(node.countryName)} ${node.nodeType}`;
  }

  render() {
    const {
      tabs,
      panels,
      editMode,
      getMoreItems,
      dirtyBlocks,
      activePanelId,
      setActivePanel,
      countriesPanel,
      sourcesPanel,
      getSearchResults,
      destinationsPanel,
      companiesPanel,
      clearActiveItem,
      setActiveTab,
      setActiveItem,
      sources,
      destinations,
      countries,
      companies,
      commodities,
      onContinue,
      commoditiesPanel,
      setSearchResult,
      dynamicSentenceParts,
      loading
    } = this.props;
    return (
      <div className="c-dashboard-panel">
        <div ref={this.containerRef} className="dashboard-panel-content">
          <h2 className="dashboard-panel-title title -center -light">
            {editMode ? 'Edit options' : 'Choose the options you want to add to the dashboard'}
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
              page={sourcesPanel.page}
              getMoreItems={getMoreItems}
              setSearchResult={item => setSearchResult(item, activePanelId)}
              getSearchResults={getSearchResults}
              loadingMoreItems={sourcesPanel.loadingItems}
              loading={loading}
              clearItems={() => clearActiveItem(activePanelId)}
              activeCountryItem={countriesPanel.activeItem}
              activeSourceTab={sourcesPanel.activeTab}
              activeSourceItem={sourcesPanel.activeItem}
              searchSources={
                !countriesPanel.activeItem
                  ? countriesPanel.searchResults
                  : sourcesPanel.searchResults
              }
              tabs={tabs}
              sources={sources[sourcesPanel.activeTab && sourcesPanel.activeTab.id] || []}
              countries={countries}
              onSelectCountry={item => setActiveItem(item, 'countries')}
              onSelectSourceTab={item => setActiveTab(item, activePanelId)}
              onSelectSourceValue={item => setActiveItem(item, activePanelId)}
            />
          )}
          {activePanelId === 'destinations' && (
            <DestinationsPanel
              page={destinationsPanel.page}
              getMoreItems={getMoreItems}
              getSearchResults={getSearchResults}
              searchDestinations={destinationsPanel.searchResults}
              destinations={destinations}
              onSelectDestinationValue={item => setActiveItem(item, activePanelId)}
              loadingMoreItems={destinationsPanel.loadingItems}
              loading={loading}
              activeDestination={destinationsPanel.activeItem}
            />
          )}
          {activePanelId === 'companies' && (
            <CompaniesPanel
              tabs={tabs}
              page={companiesPanel.page}
              getMoreItems={getMoreItems}
              searchCompanies={companiesPanel.searchResults}
              nodeTypeRenderer={DashboardPanel.countryNameNodeTypeRenderer}
              setSearchResult={item => setSearchResult(item, activePanelId)}
              getSearchResults={getSearchResults}
              loadingMoreItems={companiesPanel.loadingItems}
              loading={loading}
              companies={companies[companiesPanel.activeTab && companiesPanel.activeTab.id] || []}
              onSelectNodeTypeTab={item => setActiveTab(item, activePanelId)}
              onSelectCompany={item => setActiveItem(item, activePanelId)}
              activeNodeTypeTab={companiesPanel.activeTab}
              activeCompany={companiesPanel.activeItem}
            />
          )}
          {activePanelId === 'commodities' && (
            <CommoditiesPanel
              page={commoditiesPanel.page}
              getMoreItems={getMoreItems}
              loadingMoreItems={commoditiesPanel.loadingItems}
              loading={loading}
              commodities={commodities}
              onSelectCommodity={item => setActiveItem(item, activePanelId)}
              activeCommodity={commoditiesPanel.activeItem}
            />
          )}
        </div>
        {dynamicSentenceParts && (
          <DashboardModalFooter
            editMode={editMode}
            isPanelFooter
            onContinue={onContinue}
            clearItem={clearActiveItem}
            dynamicSentenceParts={dynamicSentenceParts}
          />
        )}
      </div>
    );
  }
}

DashboardPanel.propTypes = {
  countries: PropTypes.array,
  companies: PropTypes.object,
  getMoreItems: PropTypes.func,
  commodities: PropTypes.array,
  dirtyBlocks: PropTypes.object,
  activePanelId: PropTypes.string,
  sources: PropTypes.object,
  tabs: PropTypes.array,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  commoditiesPanel: PropTypes.object,
  panels: PropTypes.array.isRequired,
  destinations: PropTypes.array.isRequired,
  onContinue: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  dynamicSentenceParts: PropTypes.array,
  setActiveTab: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  clearActiveItem: PropTypes.func.isRequired,
  setActivePanel: PropTypes.func.isRequired,
  sourcesPanel: PropTypes.object.isRequired,
  destinationsPanel: PropTypes.object.isRequired,
  companiesPanel: PropTypes.object.isRequired,
  countriesPanel: PropTypes.object.isRequired
};

export default DashboardPanel;
