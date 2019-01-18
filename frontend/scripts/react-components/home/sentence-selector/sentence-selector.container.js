import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';

import SentenceSelector from 'react-components/home/sentence-selector/sentence-selector.component';
import { selectContextById, toggleDropdown } from 'actions/app.actions';

function mapStateToProps(state) {
  const contexts = sortBy(state.app.contexts, ['commodityName', 'countryName']);

  return {
    contexts,
    selectedYears: state.tool.selectedYears,
    selectedContext: state.app.selectedContext,
    currentDropdown: state.app.currentDropdown
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectContextById, toggleDropdown }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceSelector);
