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
    clearItems,
    countries,
    onSelectCountry,
    onSelectSourceTab,
    nodeTypeRenderer,
    onSelectSourceValue,
    activeSourceTab,
    activeSourceItem
  } = props;
  const showJurisdictions = activeCountryItem && tabs.length > 0 && sources.length > 0;
  return (
    <React.Fragment>
      <SearchInput
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
        loading={!activeCountryItem && loading}
      >
        {itemProps => (
          <GridListItem
            {...itemProps}
            isActive={
              (activeCountryItem && activeCountryItem.id) === (itemProps.item && itemProps.item.id)
            }
            enableItem={onSelectCountry}
            disableItem={clearItems}
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
                  isActive={
                    (activeSourceItem && activeSourceItem.id) ===
                    (itemProps.item && itemProps.item.id)
                  }
                  enableItem={onSelectSourceValue}
                  disableItem={() => onSelectSourceValue(null)}
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
  loadingMoreItems: PropTypes.bool,
  loading: PropTypes.bool,
  page: PropTypes.number.isRequired,
  searchSources: PropTypes.array.isRequired,
  sources: PropTypes.array,
  countries: PropTypes.array,
  getMoreItems: PropTypes.func.isRequired,
  activeCountryItem: PropTypes.object,
  activeSourceTab: PropTypes.object,
  activeSourceItem: PropTypes.object,
  tabs: PropTypes.array.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  clearItems: PropTypes.func.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  onSelectSourceValue: PropTypes.func.isRequired,
  onSelectSourceTab: PropTypes.func.isRequired,
  nodeTypeRenderer: PropTypes.func.isRequired
};

SourcesPanel.defaultProps = {
  sources: []
};

export default SourcesPanel;
