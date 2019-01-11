import createReducer from 'utils/createReducer';
import {
  LOGISTICS_MAP__SET_COMPANIES,
  LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM
} from 'react-components/logistics-map/logistics-map.actions';

const initialState = {
  companies: {}
};

const logisticsMapReducer = {
  [LOGISTICS_MAP__SET_COMPANIES](state, action) {
    const { data, commodity } = action.payload;
    const items = data.rows.map((item, i) => ({ id: i, name: item.company }));

    return { ...state, companies: { ...state.companies, [commodity]: items } };
  },
  [LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM](state, action) {
    return { ...state, searchTerm: action.payload };
  }
};

const logisticsMapReducerTypes = PropTypes => {
  const CompanyList = PropTypes.shape({ id: PropTypes.number, name: PropTypes.string });
  return {
    companies: PropTypes.shape({
      soy: PropTypes.arrayOf(PropTypes.shape(CompanyList)),
      cattle: PropTypes.arrayOf(PropTypes.shape(CompanyList))
    })
  };
};

export default createReducer(initialState, logisticsMapReducer, logisticsMapReducerTypes);
