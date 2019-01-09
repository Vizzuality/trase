import { connect } from 'react-redux';
import {
  setCompanyActive,
  setCompanySearchTerm
} from 'react-components/logistics-map/logistics-map.actions';
import {
  getActiveParams,
  getCurrentCompanies,
  getCurrentSearchedCompanies
} from 'react-components/logistics-map/logistics-map.selectors';
import LogisticsMapPanel from 'react-components/logistics-map/logistics-map-panel/logistics-map-panel.component';

const mapStateToProps = state => ({
  items: getCurrentCompanies(state),
  activeItems: getActiveParams(state).companies,
  searchResults: getCurrentSearchedCompanies(state)
});

const mapDispatchToProps = {
  filterItems: setCompanySearchTerm,
  enableItem: item => setCompanyActive(item, true),
  disableItem: item => setCompanyActive(item, false)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapPanel);
