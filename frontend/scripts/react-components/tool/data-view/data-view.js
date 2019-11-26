import { connect } from 'react-redux';
import {
  getSelectedRecolorBy,
  getToolGroupedCharts
} from 'react-components/tool-links/tool-links.selectors';
import DataView from './data-view.component';

const mapStateToProps = state => ({
  loading: state.toolLinks.chartsLoading,
  selectedRecolorBy: getSelectedRecolorBy,
  groupedCharts: getToolGroupedCharts(state)
});

export default connect(mapStateToProps)(DataView);
