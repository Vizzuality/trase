import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';

import SentenceSelector from 'react-components/home/sentence-selector/sentence-selector.component';
import { selectContext } from 'actions/tool.actions';

function mapStateToProps(state) {
  const { contexts } = state.tool;
  const contextsDict = contexts.reduce(
    (acc, ctx) => ({
      ...acc,
      [ctx.commodityName.toLowerCase()]: [
        ...(acc[ctx.commodityName.toLowerCase()] || []),
        { name: capitalize(ctx.countryName), id: ctx.id }
      ]
    }),
    {}
  );
  return {
    contextsDict
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
