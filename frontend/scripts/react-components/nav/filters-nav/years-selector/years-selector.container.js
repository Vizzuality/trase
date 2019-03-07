import { connect } from 'react-redux';
import { selectYears } from 'actions/app.actions';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.component';
import { getToolYearsProps } from 'react-components/nav/filters-nav/filters-nav.selectors';

const mapStateToProps = state => getToolYearsProps(state);

const mapDispatchToProps = dispatch => ({
  onSelected: years => {
    dispatch(selectYears(years));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearsSelector);
