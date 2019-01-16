import { connect } from 'react-redux';
import { getActiveParams } from 'react-components/logistics-map/logistics-map.selectors';
import {
  setCompanyActive,
  updateQueryParams
} from 'react-components/logistics-map/logistics-map.actions';
import LogisticsMapBar from 'react-components/logistics-map/logistics-map-bar/logistics-map-bar.component';

const mapStateToProps = state => ({
  activeItems: getActiveParams(state).companies
});

const mapDispatchToProps = {
  removeItem: companyName => setCompanyActive(companyName, false),
  clearItems: () => updateQueryParams({ companies: [] })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapBar);
