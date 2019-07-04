import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import SourcesPanel from 'react-components/dashboard-element/dashboard-panel/sources-panel.component';

function ProfileStepPanel(props) {
  const {
    setProfilesActiveItem,
    setProfilesActiveItems,
    clearProfilesPanel,
    setProfilesActiveTab,
    getSearchResults,
    setSearchResult,
    getMoreItems,
    countriesPanel,
    sourcesPanel,
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
            page={sourcesPanel.page}
            getMoreItems={getMoreItems}
            searchSources={
              !countriesPanel.activeItems
                ? countriesPanel.searchResults
                : sourcesPanel.searchResults
            }
            getSearchResults={getSearchResults}
            loadingMoreItems={sourcesPanel.loadingItems}
            clearItems={() => clearProfilesPanel(panelName)}
            activeCountryItem={countriesPanel.activeItems}
            activeSourceTab={sourcesPanel.activeTab}
            activeSourceItem={sourcesPanel.activeItems}
            onSelectCountry={item => setProfilesActiveItem(item, 'countries')}
            onSelectSourceTab={item => setProfilesActiveTab(item, panelName)}
            setSearchResult={item => setSearchResult(item, panelName)}
            onSelectSourceValue={item => setProfilesActiveItems(item, panelName)}
            nodeTypeRenderer={node => node.nodeType || 'Country of Production'}
            sources={data.sources[sourcesPanel.activeTab && sourcesPanel.activeTab.id] || []}
          />
        </>
      );
    default:
      return null;
  }
}

ProfileStepPanel.propTypes = {
  setProfilesActiveItem: PropTypes.func.isRequired,
  setProfilesActiveItems: PropTypes.func.isRequired,
  clearProfilesPanel: PropTypes.func.isRequired,
  setProfilesActiveTab: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getMoreItems: PropTypes.func.isRequired,
  countriesPanel: PropTypes.object,
  sourcesPanel: PropTypes.object,
  profileType: PropTypes.string,
  tabs: PropTypes.array,
  panelName: PropTypes.string.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default ProfileStepPanel;
