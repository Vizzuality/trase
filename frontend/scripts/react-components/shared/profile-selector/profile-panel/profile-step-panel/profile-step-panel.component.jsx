import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/profile-selector/profile-panel/profile-panel.scss';
import addApostrophe from 'utils/addApostrophe';
import Dropdown from 'react-components/shared/dropdown';
import Text from 'react-components/shared/text';
import ShrinkingSpinner from 'scripts/react-components/shared/shrinking-spinner/shrinking-spinner.component';
import ProfilesCompaniesPanel from './profiles-companies-panel.component';
import ProfilesSourcesPanel from './profiles-sources-panel.component';
import ProfilesDestinationsPanel from './profiles-destinations-panel.component';
import 'react-components/shared/profile-selector/profile-panel/profile-step-panel/profile-step-panel.scss';

function ProfileStepPanel(props) {
  const {
    sourcesTabs,
    companiesTabs,
    sourcesActiveTab,
    companiesActiveTab,
    companiesData,
    countriesActiveItems,
    setProfilesActiveItem,
    setProfilesActiveTab,
    getSearchResults,
    setProfilesSearchResult,
    getMoreItems,
    panels,
    data,
    profileType
  } = props;
  const { sources, countries, companies, destinations } = panels;
  switch (profileType) {
    case 'sources':
      return (
        <ProfilesSourcesPanel
          tabs={sourcesTabs}
          loading={sources.loadingItems}
          countries={data.countries}
          page={sources.page}
          getMoreItems={getMoreItems}
          searchSources={!countries.activeItems ? countries.searchResults : sources.searchResults}
          getSearchResults={getSearchResults}
          loadingMoreItems={sources.loadingItems}
          activeCountryItems={countriesActiveItems}
          sourcesActiveTab={sourcesActiveTab}
          activeSourceItem={sources.activeItems}
          onSelectCountry={item => setProfilesActiveItem(item, 'countries')}
          onSelectSourceTab={item => setProfilesActiveTab(item?.id, 'sources')}
          setSearchResult={item => setProfilesSearchResult(item, 'sources')}
          onSelectSourceValue={item => setProfilesActiveItem(item, 'sources')}
          nodeTypeRenderer={node => node.nodeType || 'Country of Production'}
          sources={data.sources[sourcesActiveTab] || []}
          sourcesRequired
        />
      );
    case 'destinations': {
      return (
        <ProfilesDestinationsPanel
          loading={destinations.loadingItems}
          destinations={data.destinations}
          nodeTypeRenderer={node => node.nodeType || 'Country'}
          page={destinations.page}
          searchDestinations={destinations.searchResults}
          getSearchResults={getSearchResults}
          loadingMoreItems={destinations.loadingItems}
          getMoreItems={getMoreItems}
          activeDestinationsItem={destinations.activeItems}
          onSelectDestinationValue={item => setProfilesActiveItem(item, 'destinations')}
          setSearchResult={item => setProfilesSearchResult(item, 'destinations')}
        />
      );
    }
    case 'companies': {
      const toOption = d => ({ label: d.name, value: d.id });
      const options = data.countries?.map(toOption);
      const activeCountry = (countriesActiveItems && countriesActiveItems[0]) || data.countries[0];

      if (!activeCountry || companiesTabs.length === 0)
        return <ShrinkingSpinner className="-large" />;

      const selectedCountry = toOption(activeCountry);

      const getCountryName = node => data.countries.find(c => c.id === node.countryId)?.name;
      const countryNameNodeTypeRenderer = node => {
        const countryName = getCountryName(node);
        return `${countryName + addApostrophe(countryName)} ${node.nodeType}`;
      };

      return (
        <ProfilesCompaniesPanel
          actionComponent={
            <div className="profile-panel-dropdown-container">
              <Text variant="sans" as="span" color="grey-faded" weight="bold">
                country:
              </Text>
              <Dropdown
                variant="panel"
                options={options}
                value={selectedCountry}
                onChange={item =>
                  setProfilesActiveItem(
                    data.countries.find(i => i.id === item.value),
                    'countries'
                  )
                }
              />
            </div>
          }
          tabs={companiesTabs}
          onSelectNodeTypeTab={item => setProfilesActiveTab(item?.id, 'companies')}
          page={companies.page}
          getMoreItems={getMoreItems}
          searchCompanies={companies.searchResults}
          nodeTypeRenderer={countryNameNodeTypeRenderer}
          setSearchResult={item => setProfilesSearchResult(item, 'companies')}
          getSearchResults={getSearchResults}
          loadingMoreItems={companies.loadingItems}
          loading={companies.loadingItems}
          companies={companiesData}
          onSelectCompany={item => setProfilesActiveItem(item, 'companies')}
          activeNodeTypeTab={companiesActiveTab}
          activeCompanies={companies.activeItems}
        />
      );
    }
    default:
      return null;
  }
}

ProfileStepPanel.propTypes = {
  setProfilesActiveItem: PropTypes.func.isRequired,
  setProfilesActiveTab: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  setProfilesSearchResult: PropTypes.func.isRequired,
  getMoreItems: PropTypes.func.isRequired,
  panels: PropTypes.object,
  profileType: PropTypes.string,
  companiesTabs: PropTypes.array,
  data: PropTypes.object,
  sourcesTabs: PropTypes.array,
  companiesData: PropTypes.array,
  countriesActiveItems: PropTypes.array,
  companiesActiveTab: PropTypes.number,
  sourcesActiveTab: PropTypes.number
};

export default ProfileStepPanel;
