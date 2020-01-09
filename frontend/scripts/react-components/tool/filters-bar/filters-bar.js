import { connect } from 'react-redux';
import FiltersBar from 'react-components/tool/filters-bar/filters-bar.component';

const mapStateToProps = state => ({});

export { default as EditFilter } from './edit-filter/edit-filter.component';
export default connect(mapStateToProps)(FiltersBar);
