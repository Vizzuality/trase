import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import Text from 'react-components/shared/text/text.component';
import capitalize from 'lodash/capitalize';
import Accordion from '../../shared/accordion/accordion.component';
import 'react-components/dashboard-element/dashboard-panel/sources-panel.scss';

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
    activeSourceItem,
    sourcesRequired
  } = props;

  const [sourcesOpen, changeSourcesOpen] = useState(sourcesRequired);
  const toggleSourcesOpen = () => changeSourcesOpen(!sourcesOpen);

  const hasActiveCountryItems = Object.keys(activeCountryItem).length > 0;
  const showJurisdictions = hasActiveCountryItems && tabs.length > 0;
  const activeCountryName =
    hasActiveCountryItems && capitalize(Object.values(activeCountryItem)[0].name);
  return (
    <div className="c-sources-panel">
      <GridList
        className="sources-panel-pill-list"
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
        <Accordion
          title={`${activeCountryName} regions${sourcesRequired ? '' : ' (Optional)'}`}
          defaultValue={Object.keys(activeSourceItem).length > 0 || sourcesOpen}
          onToggle={toggleSourcesOpen}
        >
          <Text color="grey-faded" className="sources-panel-sources-subtitle">
            You can choose several places of the same category:
          </Text>
          <SearchInput
            variant="bordered"
            size="sm"
            className="sources-panel-search"
            items={searchSources}
            placeholder="Search place"
            onSelect={item => (!item.nodeType ? onSelectCountry(item) : setSearchResult(item))}
            onSearchTermChange={getSearchResults}
            nodeTypeRenderer={nodeTypeRenderer}
          />
          <Tabs
            tabs={tabs}
            onSelectTab={onSelectSourceTab}
            selectedTab={activeSourceTab && activeSourceTab.id}
            itemTabRenderer={i => i.name}
            getTabId={item => item.id}
          >
            <GridList
              className="sources-panel-pill-list"
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
        </Accordion>
      )}
    </div>
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
  onSelectSourceValue: PropTypes.func.isRequired,
  sourcesRequired: PropTypes.bool
};

SourcesPanel.defaultProps = {
  sources: [],
  sourcesRequired: false
};

export default SourcesPanel;
