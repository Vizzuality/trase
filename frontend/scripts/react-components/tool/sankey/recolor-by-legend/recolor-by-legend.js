import { connect } from 'react-redux';
import RecolorByLegend from './recolor-by-legend.component';
import { getRecolorByLegend } from './recolor-by-legend.selectors';

const mapStateToProps = state => ({
  recolorBy: getRecolorByLegend(state)
});

export default connect(mapStateToProps)(RecolorByLegend);
