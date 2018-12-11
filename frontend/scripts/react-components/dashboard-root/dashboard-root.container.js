import { connect } from 'react-redux';
import DasboardRoot from 'react-components/dashboard-root/dashboard-root.component';

const mapStateToProps = state => ({
  dashboardTemplates: state.dashboardRoot.dashboardTemplates,
  loadingDashboardTemplates: state.dashboardRoot.loadingDashboardTemplates
});

export default connect(mapStateToProps)(DasboardRoot);
