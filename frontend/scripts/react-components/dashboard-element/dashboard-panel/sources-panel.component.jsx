import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';

function SourcesPanel(props) {
  const {
    tabs,
    page,
    getMoreItems,
    searchSources,
    loadingMoreItems,
    loading,
    setSearchResult,
    getSearchResults,
    activeCountryItem,
    sources,
    countries,
    onSelectCountry,
    onSelectSourceTab,
    nodeTypeRenderer,
    onSelectSourceValue,
    activeSourceTab,
    activeSourceItem
  } = props;
  const hasActiveCountryItems = Object.keys(activeCountryItem).length > 0;
  const showJurisdictions = hasActiveCountryItems && tabs.length > 0 && sources.length > 0;
  return (
    <React.Fragment>
      <SearchInput
        variant="bordered"
        size="sm"
        className="dashboard-panel-search"
        items={searchSources}
        placeholder="Search place"
        onSelect={item => (!item.nodeType ? onSelectCountry(item) : setSearchResult(item))}
        onSearchTermChange={getSearchResults}
        nodeTypeRenderer={nodeTypeRenderer}
      />
      <GridList
        className="dashboard-panel-pill-list"
        height={Math.min(200, Math.ceil(countries.length / 5) * 50)}
        width={950}
        columnWidth={190}
        rowHeight={50}
        columnCount={5}
        items={countries}
        loading={!hasActiveCountryItems && loading}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={!!activeCountryItem[itemProps.item && itemProps.item.id]}
            enableItem={onSelectCountry}
            disableItem={() => onSelectCountry({})}
          />
        )}
      </GridList>
      {showJurisdictions && (
        <React.Fragment>
          <Tabs
            tabs={tabs}
            onSelectTab={onSelectSourceTab}
            selectedTab={activeSourceTab && activeSourceTab.id}
            itemTabRenderer={i => i.name}
            getTabId={item => item.id}
          >
            <GridList
              className="dashboard-panel-pill-list"
              items={sources}
              height={sources.length > 5 ? 200 : 50}
              width={950}
              rowHeight={50}
              columnWidth={190}
              columnCount={5}
              page={page}
              getMoreItems={getMoreItems}
              loadingMoreItems={loadingMoreItems}
              loading={loading}
            >
              {itemProps => (
                <GridListItem
                  {...itemProps}
                  isActive={!!activeSourceItem[itemProps.item && itemProps.item.id]}
                  enableItem={onSelectSourceValue}
                  disableItem={onSelectSourceValue}
                />
              )}
            </GridList>
          </Tabs>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

SourcesPanel.propTypes = {
  loading: PropTypes.bool,
  sources: PropTypes.array,
  countries: PropTypes.array,
  tabs: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func,
  loadingMoreItems: PropTypes.bool,
  page: PropTypes.number.isRequired,
  activeSourceTab: PropTypes.object,
  activeSourceItem: PropTypes.object,
  activeCountryItem: PropTypes.object,
  getMoreItems: PropTypes.func.isRequired,
  searchSources: PropTypes.array.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectSourceTab: PropTypes.func.isRequired,
  onSelectSourceValue: PropTypes.func.isRequired
};

SourcesPanel.defaultProps = {
  sources: []
};

export default SourcesPanel;
