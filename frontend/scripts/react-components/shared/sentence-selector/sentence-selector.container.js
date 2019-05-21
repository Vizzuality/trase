import { connect } from 'react-redux';

import SentenceSelector from 'react-components/shared/sentence-selector/sentence-selector.component';
import { selectContextById } from 'actions/app.actions';
import {
  getSortedContexts,
  getSelectedCommodityPairs,
  getSelectedCountryPairs
} from 'react-components/shared/sentence-selector/sentence-selector.selectors';

function mapStateToProps(state) {
  const { query: { lang } = {} } = state.location;
  const contexts = getSortedContexts(state);
  const selectedCountryPairs = getSelectedCountryPairs(state);
  const selectedCommodityPairs = getSelectedCommodityPairs(state);

  return {
    lang,
    contexts,
    selectedCountryPairs,
    selectedCommodityPairs,
    selectedYears: state.app.selectedYears,
    selectedContext: state.app.selectedContext
  };
}

const mapDispatchToProps = {
  selectContextById
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceSelector);
