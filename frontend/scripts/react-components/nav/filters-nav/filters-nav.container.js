import { toggleMap } from 'actions/app.actions';
import { selectBiomeFilter, selectStateFilter } from 'actions/tool.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import routerLinks from 'router/nav-links';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    selectedContext: state.tool.selectedContext,
    isMapVisible: state.tool.isMapVisible,
    selectedBiomeFilter: state.tool.selectedBiomeFilter,
    selectedStateFilter: state.tool.selectedStateFilter
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openMap: () => toggleMap(true),
      openSankey: () => toggleMap(false),
      onBiomeSelected: filterNode => selectBiomeFilter(filterNode),
      onStateSelected: filterNode => selectStateFilter(filterNode)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FiltersNav);
