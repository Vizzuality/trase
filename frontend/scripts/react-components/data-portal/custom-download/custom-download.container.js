import { connect } from 'react-redux';
import { dataPortalActions } from 'react-components/data-portal/data-portal.register';
import {
  getConsumptionCountryOptions,
  getCommodityOptions,
  getCountryOptions,
  getExporterOptions,
  getYearOptions,
  getIndicatorOptions
} from 'react-components/data-portal/data-portal.selectors';
import CustomDownload from './custom-download.component';

const mapStateToProps = state => ({
  consumptionCountryOptions: getConsumptionCountryOptions(state),
  exporterOptions: getExporterOptions(state),
  commodityOptions: getCommodityOptions(state),
  yearOptions: getYearOptions(state),
  countryOptions: getCountryOptions(state),
  indicatorOptions: getIndicatorOptions(state)
});

const mapDispatchToProps = {
  setSelectedCountryId: dataPortalActions.setSelectedCountryId,
  setSelectedCommodityId: dataPortalActions.setSelectedCommodityId
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomDownload);
