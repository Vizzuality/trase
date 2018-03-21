import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';

import SentenceSelector from 'react-components/home/sentence-selector/sentence-selector.component';
import { selectContext } from 'actions/tool.actions';

function mapStateToProps(state) {
  const contexts = sortBy(
    state.tool.contexts.map(c => ({
      id: c.id,
      countryName: capitalize(c.countryName),
      commodityName: c.commodityName.toLowerCase(),
      isDefault: c.isDefault
    })),
    ['commodityName', 'countryName']
  );

  return {
    contexts
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectContext,
      resetContext: () => selectContext(null, { isInitialContextSet: true })
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SentenceSelector);
