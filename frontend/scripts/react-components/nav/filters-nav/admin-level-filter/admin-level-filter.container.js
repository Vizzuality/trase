import { connect } from 'react-redux';
import { toggleDropdown } from 'actions/app.actions';
import AdminLevelFilter from 'react-components/nav/filters-nav/admin-level-filter/admin-level-filter.component';

const mapStateToProps = state => ({
  currentDropdown: state.app.currentDropdown
});

const mapDispatchToProps = dispatch => ({
  onToggle: id => {
    dispatch(toggleDropdown(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLevelFilter);
