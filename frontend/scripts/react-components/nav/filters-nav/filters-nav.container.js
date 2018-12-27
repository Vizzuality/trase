import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleDropdown, toggleMap } from 'actions/app.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import { getNavFilters } from 'react-components/nav/filters-nav/filters-nav.selectors';
import routerLinks from 'router/nav-links';
import {
  selectLogisticsMapYear,
  selectLogisticsMapContext
} from 'react-components/logistics-map/logistics-map.actions';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    filters: getNavFilters(state),
    isMapVisible: state.tool.isMapVisible,
    currentDropdown: state.app.currentDropdown
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleDropdown,
      openMap: () => toggleMap(true),
      openSankey: () => toggleMap(false),
      logisticsMapYear_onSelected: selectLogisticsMapYear,
      logisticsMapContext_onSelected: selectLogisticsMapContext
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersNav);
