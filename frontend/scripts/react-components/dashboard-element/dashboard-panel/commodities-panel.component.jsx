import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input/search-input.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

class CommoditiesPanel extends React.PureComponent {
  static propTypes = {
    getData: PropTypes.func,
    commodities: PropTypes.array,
    searchCommodities: PropTypes.array,
    activeCommodityId: PropTypes.string,
    onSelectCommodity: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getData();
  }

  render() {
    const { searchCommodities, commodities, activeCommodityId, onSelectCommodity } = this.props;
    return (
      <React.Fragment>
        <SearchInput
          className="dashboard-panel-search"
          items={searchCommodities}
          placeholder="Search place"
          onSelect={i => i}
        />
        <GridList
          className="dashboard-panel-pill-list"
          items={commodities}
          height={commodities.length > 5 ? 200 : 50}
          width={950}
          rowHeight={50}
          columnWidth={190}
          columnCount={5}
        >
          {itemProps => (
            <GridListItem
              {...itemProps}
              isActive={activeCommodityId === (itemProps.item && itemProps.item.id)}
              enableItem={onSelectCommodity}
              disableItem={() => onSelectCommodity(null)}
            />
          )}
        </GridList>
      </React.Fragment>
    );
  }
}

export default CommoditiesPanel;
