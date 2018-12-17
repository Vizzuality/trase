import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleMap } from 'actions/app.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import {
  getNavFilters,
  getContextsForLogisticsMap
} from 'react-components/nav/filters-nav/filters-nav.selectors';
import routerLinks from 'router/nav-links';

function mapStateToProps(state) {
  return {
    selectContexts: getContextsForLogisticsMap(state),
    links: routerLinks.nav,
    filters: getNavFilters(state),
    selectedContext: state.app.selectedContext,
    contextIsUserSelected: state.app.contextIsUserSelected,
    isMapVisible: state.tool.isMapVisible
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openMap: () => toggleMap(true),
      openSankey: () => toggleMap(false)
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersNav);
