import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';
import Tabs from 'react-components/shared/tabs.component';

class SourcesPanel extends React.PureComponent {
  componentDidMount() {
    this.props.getCountriesData();
  }

  componentDidUpdate(prevProps) {
    const {
      tabs,
      getSourcesData,
      onSelectSourceTab,
      activeCountryItemId,
      activeSourceItemId,
      activeSourceTabId
    } = this.props;

    if (
      tabs.length > 0 &&
      (prevProps.tabs && prevProps.tabs[0] && prevProps.tabs[0].id) !== tabs[0].id
    ) {
      onSelectSourceTab(tabs[0]);
    }

    const shouldGetData = [
      prevProps.activeCountryItemId !== activeCountryItemId,
      prevProps.activeSourceTabId !== activeSourceTabId,
      prevProps.activeSourceItemId !== activeSourceItemId
    ];
    if (shouldGetData.includes(true)) {
      getSourcesData();
    }
  }

  render() {
    const {
      tabs,
      searchSources,
      activeCountryItemId,
      sources,
      clearItems,
      onSelectCountry,
      onSelectSourceTab,
      onSelectSourceValue,
      activeSourceTabId,
      getSourcesData,
      activeSourceItemId
    } = this.props;
    return (
      <React.Fragment>
        <SearchInput
          className="dashboard-panel-search"
          items={searchSources}
          placeholder="Search place"
          onSelect={i => i}
        />
        <GridList
          height={50}
          width={950}
          columnWidth={190}
          rowHeight={50}
          columnCount={4}
          items={searchSources}
        >
          {itemProps => (
            <GridListItem
              {...itemProps}
              isActive={activeCountryItemId === (itemProps.item && itemProps.item.id)}
              enableItem={onSelectCountry}
              disableItem={activeSourceItemId === null ? () => onSelectCountry(null) : clearItems}
            />
          )}
        </GridList>
        {activeCountryItemId &&
          tabs.length > 0 && (
            <React.Fragment>
              <Tabs
                tabs={tabs}
                onSelectTab={onSelectSourceTab}
                selectedTab={activeSourceTabId}
                itemTabRenderer={i => i.name}
                getTabId={item => item.id}
              >
                <GridList
                  items={sources}
                  height={sources.length > 5 ? 200 : 50}
                  width={800}
                  rowHeight={50}
                  columnWidth={160}
                  columnCount={5}
                  getMoreItems={getSourcesData}
                >
                  {itemProps => (
                    <GridListItem
                      {...itemProps}
                      isActive={activeSourceItemId === (itemProps.item && itemProps.item.id)}
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
}

SourcesPanel.propTypes = {
  searchSources: PropTypes.array.isRequired,
  sources: PropTypes.object.isRequired,
  activeCountryItemId: PropTypes.number,
  activeSourceTabId: PropTypes.number,
  activeSourceItemId: PropTypes.string,
  tabs: PropTypes.array.isRequired,
  onSelectCountry: PropTypes.func.isRequired,
  clearItems: PropTypes.func.isRequired,
  onSelectSourceValue: PropTypes.func.isRequired,
  onSelectSourceTab: PropTypes.func.isRequired,
  getSourcesData: PropTypes.func.isRequired,
  getCountriesData: PropTypes.func.isRequired
};

export default SourcesPanel;
