import { connect } from 'react-redux';

import SentenceSelector from 'react-components/shared/sentence-selector/sentence-selector.component';
import { selectContextById, selectYears } from 'actions/app.actions';
import {
  getSortedContexts,
  getSelectedCommodityPairs,
  getSelectedCountryPairs
} from 'react-components/shared/sentence-selector/sentence-selector.selectors';

function mapStateToProps(state) {
  const contexts = getSortedContexts(state);
  const selectedCountryPairs = getSelectedCountryPairs(state);
  const selectedCommodityPairs = getSelectedCommodityPairs(state);

  return {
    contexts,
    selectedCountryPairs,
    selectedCommodityPairs,
    selectedYears: state.app.selectedYears,
    selectedContext: state.app.selectedContext
  };
}

const mapDispatchToProps = {
  selectYears,
  selectContextById
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceSelector);
