import { connect } from 'react-redux';
import RecolorByLegend from './recolor-by-legend.component';
import { getRecolorByLegend } from './recolor-by-legend.selectors';

const mapStateToProps = (state, ownProps) => ({
  recolorBy: getRecolorByLegend(state, ownProps)
});

export default connect(mapStateToProps)(RecolorByLegend);
