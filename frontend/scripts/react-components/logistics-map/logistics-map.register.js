import reducerRegistry from 'reducer-registry';
import reducer from './logistics-map.reducer';

reducerRegistry.register('logisticsMap', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  LOGISTICS_MAP__SET_COMPANIES,
  LOGISTICS_MAP__SET_ACTIVE_MODAL,
  LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM,
  updateQueryParams,
  selectLogisticsMapYear,
  selectLogisticsMapHub,
  selectLogisticsMapInspectionLevel,
  setLayerActive,
  getLogisticsMapCompanies,
  setCompanyActive,
  setCompanySearchTerm,
  setLogisticsMapActiveModal
} from './logistics-map.actions';
