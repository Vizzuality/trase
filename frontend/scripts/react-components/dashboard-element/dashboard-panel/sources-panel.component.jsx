import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import Text from 'react-components/shared/text/text.component';
import capitalize from 'lodash/capitalize';
import ResizeListener from 'react-components/shared/resize-listener.component';
import Accordion from '../../shared/accordion/accordion.component';

import 'react-components/dashboard-element/dashboard-panel/sources-panel.scss';

function SourcesPanel(props) {
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
    activeSourcesItem,
    sourcesRequired
  } = props;
  const [sourcesOpen, changeSourcesOpen] = useState(sourcesRequired);
  const toggleSourcesOpen = () => changeSourcesOpen(!sourcesOpen);
  const itemToScrollTo = useFirstItem(sources);

  const showJurisdictions = activeCountryItems.length > 0 && tabs.length > 0;
  const activeCountryName = activeCountryItems.length > 0 && capitalize(activeCountryItems[0].name);
  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > 1000 ? 5 : 3;
        return (
          <div className="c-sources-panel">
            <GridList
              className="sources-panel-pill-list"
              height={Math.min(200, Math.ceil(countries.length / columnsCount) * 50)}
              width={950}
              columnWidth={190}
              rowHeight={50}
              columnCount={columnsCount}
              items={countries}
              loading={!activeCountryItems && loading}
            >
              {itemProps => (
                <GridListItem
                  {...itemProps}
                  isActive={activeCountryItems.find(i => i.id === itemProps.item?.id)}
                  enableItem={onSelectCountry}
                  disableItem={() => onSelectCountry(null)}
                />
              )}
            </GridList>
            {showJurisdictions && (
              <Accordion
                title={`${activeCountryName} regions${sourcesRequired ? '' : ' (Optional)'}`}
                defaultValue={activeSourcesItem.length > 0 || sourcesOpen}
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
                    className="sources-panel-pill-list"
                    items={sources}
                    height={sources.length > columnsCount ? 200 : 50}
                    width={950}
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
                        isActive={activeSourcesItem.includes(itemProps.item?.id)}
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

SourcesPanel.propTypes = {
  loading: PropTypes.bool,
  sources: PropTypes.array,
  countries: PropTypes.array,
  tabs: PropTypes.array.isRequired,
  nodeTypeRenderer: PropTypes.func,
  page: PropTypes.number.isRequired,
  sourcesActiveTab: PropTypes.number,
  activeSourcesItem: PropTypes.array,
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

SourcesPanel.defaultProps = {
  sources: [],
  sourcesRequired: false
};

export default SourcesPanel;
