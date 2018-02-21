import { connect } from 'react-redux';
import routerLinks from 'router/nav-links';
import FiltersNav from './filters-nav.component';

function mapStateToProps() {
  return {
    links: routerLinks.nav
  };
}

export default connect(mapStateToProps)(FiltersNav);
