import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';
import CompaniesPanel from 'react-components/dashboard-element/dashboard-panel/companies-panel.component';
import addApostrophe from 'utils/addApostrophe';

const countryNameNodeTypeRenderer = node =>
  `${node.countryName + addApostrophe(node.countryName)} ${node.nodeType}`;

function ProfileStepPanel(props) {
  const {
    setProfilesActiveItem,
    clearProfilesPanel,
    setProfilesActiveTab,
    getSearchResults,
    setSearchResult,
    getMoreItems,
    panels,
    data,
    loading,
    profileType,
    panelName,
    tabs
  } = props;
  switch (profileType) {
    case 'sources':
      return (
        <>
          <SourcesPanel
            tabs={tabs}
            loading={loading}
            countries={data.countries}
            page={panels.sources.page}
            getMoreItems={getMoreItems}
            searchSources={
              !panels.countries.activeItems
                ? panels.countries.searchResults
                : panels.sources.searchResults
            }
            getSearchResults={getSearchResults}
            loadingMoreItems={panels.sources.loadingItems}
            clearItems={() => clearProfilesPanel(panelName)}
            activeCountryItem={panels.countries.activeItems}
            activeSourceTab={panels.sources.activeTab}
            activeSourceItem={panels.sources.activeItems}
            onSelectCountry={item => setProfilesActiveItem(item, 'countries')}
            onSelectSourceTab={item => setProfilesActiveTab(item, 'sources')}
            setSearchResult={item => setSearchResult(item, 'sources')}
            onSelectSourceValue={item => setProfilesActiveItem(item, 'sources')}
            nodeTypeRenderer={node => node.nodeType || 'Country of Production'}
            sources={data.sources[panels.sources.activeTab && panels.sources.activeTab.id] || []}
            sourcesRequired
          />
        </>
      );
    case 'companies':
      return (
        <CompaniesPanel
          tabs={tabs}
          onSelectNodeTypeTab={item => setProfilesActiveTab(item, 'companies')}
          page={panels.companies.page}
          getMoreItems={getMoreItems}
          searchCompanies={panels.companies.searchResults}
          nodeTypeRenderer={countryNameNodeTypeRenderer}
          setSearchResult={item => setSearchResult(item, 'companies')}
          getSearchResults={getSearchResults}
          loadingMoreItems={panels.companies.loadingItems}
          loading={loading}
          companies={
            data.companies[panels.companies.activeTab && panels.companies.activeTab.id] || []
          }
          onSelectCompany={item => setProfilesActiveItem(item, 'companies')}
          activeNodeTypeTab={panels.companies.activeTab}
          activeCompany={panels.companies.activeItems}
        />
      );
    default:
      return null;
  }
}

ProfileStepPanel.propTypes = {
  setProfilesActiveItem: PropTypes.func.isRequired,
  clearProfilesPanel: PropTypes.func.isRequired,
  setProfilesActiveTab: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getMoreItems: PropTypes.func.isRequired,
  panels: PropTypes.object,
  profileType: PropTypes.string,
  tabs: PropTypes.array,
  panelName: PropTypes.string.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default ProfileStepPanel;
