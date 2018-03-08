import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectContextWithUpdates, selectContext } from 'actions/tool.actions';
import { toggleMap } from 'actions/app.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import routerLinks from 'router/nav-links';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    selectedContext: state.tool.selectedContext,
    isMapVisible: state.tool.isMapVisible
  };
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      selectContext: ownProps.isExplore ? selectContext : selectContextWithUpdates,
      openMap: () => toggleMap(true),
      openSankey: () => toggleMap(false)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FiltersNav);
