import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import capitalize from 'lodash/capitalize';
import Accordion from 'react-components/shared/accordion/accordion.component';
import ResizeListener from 'react-components/shared/resize-listener.component';
import { BREAKPOINTS } from 'constants';

import './profile-sources-panel.scss';

function ProfilesSourcesPanel(props) {
  const {
    tabs,
    page,
    getMoreItems,
    searchSources,
    loading,
    setSearchResult,
    getSearchResults,
    activeCountryItems,
    sources,
    countries,
    onSelectCountry,
    onSelectSourceTab,
    nodeTypeRenderer,
    onSelectSourceValue,
    sourcesActiveTab,
    activeSourceItem,
    sourcesRequired
  } = props;

  const [sourcesOpen, changeSourcesOpen] = useState(sourcesRequired);
  const toggleSourcesOpen = () => changeSourcesOpen(!sourcesOpen);
  const itemToScrollTo = useFirstItem(sources);

  const showJurisdictions = activeCountryItems && tabs.length > 0;
  const activeCountryName = activeCountryItems && capitalize(activeCountryItems[0].name);
  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > BREAKPOINTS.laptop ? 5 : 3;
        const width = windowWidth > BREAKPOINTS.laptop ? 950 : 560;
        return (
          <div className="c-profile-sources-panel">
            <GridList
              className="profile-sources-panel-pill-list"
              height={Math.min(200, Math.ceil(countries.length / columnsCount) * 50)}
              width={width}
              columnWidth={190}
              rowHeight={50}
              columnCount={columnsCount}
              items={countries}
              loading={!activeCountryItems && loading}
            >
              {itemProps => (
                <GridListItem
                  {...itemProps}
                  isActive={
                    activeCountryItems && activeCountryItems.find(i => i.id === itemProps.item?.id)
                  }
                  enableItem={onSelectCountry}
                  disableItem={() => onSelectCountry(null)}
                />
              )}
            </GridList>
            {showJurisdictions && (
              <Accordion
                title={`${activeCountryName} regions${sourcesRequired ? '' : ' (Optional)'}`}
                defaultValue={activeSourceItem.length > 0 || sourcesOpen}
                onToggle={toggleSourcesOpen}
              >
                <SearchInput
                  variant="bordered"
                  size="sm"
                  className="profile-sources-panel-search"
                  items={searchSources}
                  placeholder="Search place"
                  onSelect={item =>
                    !item.nodeType ? onSelectCountry(item) : setSearchResult(item)
                  }
                  onSearchTermChange={getSearchResults}
                  nodeTypeRenderer={nodeTypeRenderer}
                />
                <Tabs
                  tabs={tabs}
                  onSelectTab={onSelectSourceTab}
                  selectedTab={sourcesActiveTab}
                  itemTabRenderer={i => i.name}
                  getTabId={item => item.id}
                >
                  <GridList
                    className="profile-sources-panel-pill-list"
                    items={sources}
                    height={sources.length > columnsCount ? 200 : 50}
                    width={width}
                    rowHeight={50}
                    columnWidth={190}
                    columnCount={columnsCount}
                    page={page}
                    getMoreItems={getMoreItems}
                    loading={loading}
                    itemToScrollTo={itemToScrollTo}
                  >
                    {itemProps => (
                      <GridListItem
                        {...itemProps}
                        isActive={activeSourceItem.includes(itemProps.item?.id)}
                        enableItem={onSelectSourceValue}
                        disableItem={onSelectSourceValue}
                      />
                    )}
                  </GridList>
                </Tabs>
              </Accordion>
            )}
          </div>
        );
      }}
    </ResizeListener>
  );
}

ProfilesSourcesPanel.propTypes = {
  loading: PropTypes.bool,
  sources: PropTypes.array,
  countries: PropTypes.array,
  tabs: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func,
  page: PropTypes.number.isRequired,
  sourcesActiveTab: PropTypes.number,
  activeSourceItem: PropTypes.array,
  activeCountryItems: PropTypes.array,
  getMoreItems: PropTypes.func.isRequired,
  searchSources: PropTypes.array.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectSourceTab: PropTypes.func.isRequired,
  onSelectSourceValue: PropTypes.func.isRequired,
  sourcesRequired: PropTypes.bool
};

ProfilesSourcesPanel.defaultProps = {
  sources: [],
  sourcesRequired: false
};

export default ProfilesSourcesPanel;
