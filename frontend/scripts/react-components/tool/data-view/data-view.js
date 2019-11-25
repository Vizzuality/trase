import { connect } from 'react-redux';
import { getDashboardGroupedCharts } from 'react-components/dashboard-element/dashboard-element.selectors';
import { getSelectedRecolorBy } from 'react-components/tool-links/tool-links.selectors';
import DataView from './data-view.component';

const mapStateToProps = state => ({
  loading: state.dashboardElement.loading,
  groupedCharts: getDashboardGroupedCharts(state),
  selectedRecolorBy: getSelectedRecolorBy
});

export default connect(mapStateToProps)(DataView);
