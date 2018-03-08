import { connect } from 'react-redux';
import SentenceSelector from 'react-components/home/sentence-selector/sentence-selector.component';

function mapStateToProps(state) {
  const { contexts } = state.tool;
  const contextsDict = contexts.reduce(
    (acc, context) => ({
      ...acc,
      [context.commodityName]: [...(acc[context.commodityName] || []), context.countryName]
    }),
    {}
  );
  return {
    contextsDict
  };
}

export default connect(mapStateToProps)(SentenceSelector);
