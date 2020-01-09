import { connect } from 'react-redux';
import FiltersBar from 'react-components/tool/filters-bar/filters-bar.component';
import { getFiltersBar } from './filters-bar.selectors';

const mapStateToProps = state => {
  const { left, right } = getFiltersBar(state);
  return {
    leftSlot: left,
    rightSlot: right
  };
};

export default connect(mapStateToProps)(FiltersBar);
