import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';
import Tabs from 'react-components/shared/tabs.component';

function SourcingPanel(props) {
  const { items, activeItem, onSelectItem, tabs, onTabClick, selectedTab } = props;
  return (
    <React.Fragment>
      <SearchInput
        className="dashboard-panel-search"
        items={items}
        placeholder="Search place"
        onSelect={i => i}
      />
      <GridList
        noScroll
        height={50}
        width={720}
        columnWidth={180}
        rowHeight={50}
        columnCount={4}
        items={items}
      >
        {itemProps => (
          <GridListItem {...itemProps} activeItem={activeItem} onClick={onSelectItem} />
        )}
      </GridList>
      <p className="dashboards-panel-text">
        You can choose up to three places of the same category:
      </p>
      <Tabs tabs={tabs} onTabClick={onTabClick}>
        {selectedTab === 'biome' && <p>biome</p>}
        {selectedTab === 'state' && <p>state</p>}
      </Tabs>
    </React.Fragment>
  );
}

SourcingPanel.propTypes = {
  items: PropTypes.array.isRequired,
  activeItem: PropTypes.object,
  selectedTab: PropTypes.string,
  onSelectItem: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  onTabClick: PropTypes.func.isRequired
};

export default SourcingPanel;
