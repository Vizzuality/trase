import React from 'react';
import { connect } from 'react-redux';
import {
  updateQueryParams,
  setCompanySearchTerm
} from 'react-components/logistics-map/logistics-map.actions';
import {
  getActiveParams,
  getCurrentCompanies,
  getCurrentSearchedCompanies
} from 'react-components/logistics-map/logistics-map.selectors';
import LogisticsMapPanel from 'react-components/logistics-map/logistics-map-panel/logistics-map-panel.component';

class LogisticsMapPanelContainer extends React.PureComponent {
  state = {
    localActiveItems: this.props.activeItems || []
  };

  enableItem = item =>
    this.setState(state => ({ localActiveItems: [...state.localActiveItems, item.name] }));

  disableItem = item =>
    this.setState(state => ({
      localActiveItems: state.localActiveItems.filter(i => i !== item.name)
    }));

  goToMap = () => {
    const { localActiveItems } = this.state;
    const { setActiveItems, close } = this.props;
    setActiveItems(localActiveItems);
    close();
  };

  render() {
    const { localActiveItems } = this.state;
    return (
      <LogisticsMapPanel
        {...this.props}
        goToMap={this.goToMap}
        enableItem={this.enableItem}
        disableItem={this.disableItem}
        activeItems={localActiveItems}
      />
    );
  }
}

const mapStateToProps = state => ({
  items: getCurrentCompanies(state),
  activeItems: getActiveParams(state).companies,
  searchResults: getCurrentSearchedCompanies(state)
});

const mapDispatchToProps = {
  filterItems: setCompanySearchTerm,
  setActiveItems: items => updateQueryParams({ companies: items })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapPanelContainer);
