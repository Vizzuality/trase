import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleDropdown, toggleMap } from 'actions/app.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import { getNavFilters } from 'react-components/nav/filters-nav/filters-nav.selectors';
import routerLinks from 'router/nav-links';
import {
  selectLogisticsMapHub,
  selectLogisticsMapYear,
  setLogisticsMapActiveModal,
  selectLogisticsMapInspectionLevel
} from 'react-components/logistics-map/logistics-map.actions';
import { selectBiomeFilter, selectResizeBy, selectView } from 'actions/tool.actions';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    filters: getNavFilters(state),
    isMapVisible: state.tool && state.tool.isMapVisible,
    currentDropdown: state.app.currentDropdown
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleDropdown,
      toolViewMode_onSelected: selectView,
      toolResizeBy_onSelected: selectResizeBy,
      openMap: () => toggleMap(true),
      openSankey: () => toggleMap(false),
      openLogisticsMapDownload: () => setLogisticsMapActiveModal('download'),
      toolAdminLevel_onSelected: selectBiomeFilter,
      logisticsMapYear_onSelected: selectLogisticsMapYear,
      logisticsMapHub_onSelected: selectLogisticsMapHub,
      logisticsMapInspectionLevel_onSelected: selectLogisticsMapInspectionLevel
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersNav);
