import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import FiltersNav from 'react-components/nav/filters-nav/filters-nav.component';

function mapStateToProps(state) {
  return {
    links: routerLinks.nav,
    selectedContext: state.tool.selectedContext
  };
}

export default connect(mapStateToProps)(FiltersNav);
