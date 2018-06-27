import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleMap } from 'actions/app.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import routerLinks from 'router/nav-links';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    selectedContext: state.app.selectedContext,
    contextIsUserSelected: state.app.contextIsUserSelected,
    isMapVisible: state.tool.isMapVisible,
    isExplore: state.location.type === 'explore'
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

export default connect(mapStateToProps, mapDispatchToProps)(FiltersNav);
