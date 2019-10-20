import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Accordion from 'react-components/shared/accordion/accordion.component';
import Text from 'react-components/shared/text/text.component';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import Tabs from 'react-components/shared/tabs/tabs.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import { useFirstItem } from 'react-components/shared/grid-list/grid-list.hooks';

import './sources-panel.scss';

function SourcesPanel(props) {
  const {
    fetchData,
    accordionTitle,
    accordionValue,
    toggleAccordion,
    searchResults,
    setSearchResult,
    getSearchResults,
    nodeTypeRenderer,
    tabs,
    setSelectedTab,
    activeTab,
    sources,
    columnsCount,
    width,
    page,
    setPage,
    loading,
    selectedSourcesIds,
    onSelectSource,
    previousSteps
  } = props;

  useEffect(() => {
    fetchData();
  }, [previousSteps, fetchData]);
  const itemToScrollTo = useFirstItem(sources);
  return (
    <div className="c-sources-panel">
      <Accordion title={accordionTitle} defaultValue={accordionValue} onToggle={toggleAccordion}>
        <Text color="grey-faded" className="sources-panel-sources-subtitle">
          You can choose several places of the same category:
        </Text>
        <SearchInput
          variant="bordered"
          size="sm"
          className="sources-panel-search"
          items={searchResults}
          placeholder="Search place"
          onSelect={item => setSearchResult(item)}
          onSearchTermChange={getSearchResults}
          nodeTypeRenderer={nodeTypeRenderer}
        />
        <Tabs
          tabs={tabs}
          onSelectTab={setSelectedTab}
          selectedTab={activeTab}
          itemTabRenderer={i => i.name}
          getTabId={item => item.id}
        >
          <GridList
            className="sources-panel-pill-list"
            items={sources}
            height={sources.length > columnsCount ? 200 : 50}
            width={width}
            rowHeight={50}
            columnWidth={190}
            columnCount={columnsCount}
            page={page}
            getMoreItems={setPage}
            loading={loading}
            itemToScrollTo={itemToScrollTo}
          >
            {itemProps => (
              <GridListItem
                {...itemProps}
                isActive={selectedSourcesIds.includes(itemProps.item?.id)}
                enableItem={onSelectSource}
                disableItem={onSelectSource}
              />
            )}
          </GridList>
        </Tabs>
      </Accordion>
    </div>
  );
}

SourcesPanel.propTypes = {
  accordionTitle: PropTypes.string.isRequired,
  accordionValue: PropTypes.bool.isRequired,
  toggleAccordion: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  setSearchResult: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  nodeTypeRenderer: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
  activeTab: PropTypes.object,
  sources: PropTypes.array.isRequired,
  columnsCount: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedSourcesIds: PropTypes.array.isRequired,
  onSelectSource: PropTypes.func.isRequired
};

export default SourcesPanel;
