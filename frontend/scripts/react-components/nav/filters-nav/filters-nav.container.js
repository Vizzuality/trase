import { toggleMap } from 'actions/app.actions';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import routerLinks from 'router/nav-links';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    selectedContext: state.tool.selectedContext,
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

export default connect(mapStateToProps, mapDispatchToProps)(FiltersNav);
