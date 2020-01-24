import { connect } from 'react-redux';

import SentenceSelector from 'react-components/shared/sentence-selector/sentence-selector.component';
import { selectContextById } from 'app/app.register';
import {
  getSortedContexts,
  getSelectedCommodityPairs,
  getSelectedCountryPairs
} from 'react-components/shared/sentence-selector/sentence-selector.selectors';
import { getSelectedContext, getSelectedYears } from 'app/app.selectors';

function mapStateToProps(state) {
  const { query: { lang } = {} } = state.location;
  const contexts = getSortedContexts(state);
  const selectedContext = getSelectedContext(state);
  const selectedYears = getSelectedYears(state);
  const selectedCountryPairs = getSelectedCountryPairs(state);
  const selectedCommodityPairs = getSelectedCommodityPairs(state);

  return {
    lang,
    contexts,
    selectedYears,
    selectedContext,
    selectedCountryPairs,
    selectedCommodityPairs
  };
}

const mapDispatchToProps = {
  selectContextById
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SentenceSelector);
