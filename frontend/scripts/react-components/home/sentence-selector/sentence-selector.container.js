import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';

import SentenceSelector from 'react-components/home/sentence-selector/sentence-selector.component';
import { selectContextById } from 'actions/app.actions';

function mapStateToProps(state) {
  const contexts = sortBy(state.app.contexts, ['commodityName', 'countryName']);

  return {
    contexts,
    selectedContext: state.app.selectedContext
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({ selectContextById }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceSelector);
