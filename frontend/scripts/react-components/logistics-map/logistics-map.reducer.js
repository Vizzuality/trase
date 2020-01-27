import createReducer from 'utils/createReducer';
import {
  LOGISTICS_MAP__SET_COMPANIES,
  LOGISTICS_MAP__SET_ACTIVE_MODAL,
  LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM
} from './logistics-map.actions';
import initialState from './logistics-map.initial-state';

const logisticsMapReducer = {
  [LOGISTICS_MAP__SET_COMPANIES](state, action) {
    const { data, commodity } = action.payload;
    const items = data.rows.map((item, i) => ({ id: i, name: item.company }));

    return { ...state, companies: { ...state.companies, [commodity]: items } };
  },
  [LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM](state, action) {
    return { ...state, searchTerm: action.payload };
  },
  [LOGISTICS_MAP__SET_ACTIVE_MODAL](state, action) {
    return { ...state, activeModal: action.payload };
  }
};

const logisticsMapReducerTypes = PropTypes => {
  const CompanyList = { id: PropTypes.number, name: PropTypes.string };
  return {
    companies: PropTypes.shape({
      soy: PropTypes.arrayOf(PropTypes.shape(CompanyList)),
      cattle: PropTypes.arrayOf(PropTypes.shape(CompanyList))
    })
  };
};

export default createReducer(initialState, logisticsMapReducer, logisticsMapReducerTypes);
