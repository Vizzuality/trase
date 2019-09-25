import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleDropdown, changeLayout } from 'actions/app.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import { getNavFilters } from 'react-components/nav/filters-nav/filters-nav.selectors';
import routerLinks from 'router/nav-links';
import {
  selectLogisticsMapHub,
  selectLogisticsMapYear,
  setLogisticsMapActiveModal,
  selectLogisticsMapInspectionLevel
} from 'react-components/logistics-map/logistics-map.actions';
import {
  selectResizeBy,
  selectBiomeFilter,
  selectView
} from 'react-components/tool-links/tool-links.actions';
import { TOOL_LAYOUT } from 'constants';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    filters: getNavFilters(state),
    toolLayout: state.toolLayers && state.toolLayers.toolLayout,
    currentDropdown: state.app.currentDropdown
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleDropdown,
      toolViewMode_onSelected: selectView,
      toolResizeBy_onSelected: selectResizeBy,
      openMap: () => changeLayout(TOOL_LAYOUT.left),
      openSankey: () => changeLayout(TOOL_LAYOUT.right),
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
