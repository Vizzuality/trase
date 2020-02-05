import { connect } from 'react-redux';
import CustomDownload from './custom-download.component';

const mapStateToProps = state => ({
  consumptionCountryOptions: [],
  exporterOptions: [],
  commodityOptions: [],
  yearOptions: [],
  countryOptions: [],
  indicatorOptions: []
});

export default connect(mapStateToProps)(CustomDownload);
