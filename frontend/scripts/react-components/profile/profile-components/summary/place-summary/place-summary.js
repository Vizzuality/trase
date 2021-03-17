import { connect } from 'react-redux';
import { getProfilePlaceBounds } from 'react-components/profile/profile.actions';
import PlaceSummaryComponent from './place-summary.component';

const mapStateToProps = state => ({
  placeBounds: state && state.profile && state.profile.placeBounds
});
const mapDispatchToProps = { getProfilePlaceBounds };
export default connect(mapStateToProps, mapDispatchToProps)(PlaceSummaryComponent);
