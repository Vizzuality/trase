import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SentenceSelector from 'react-components/home/sentence-selector/sentence-selector.component';
import { selectContext } from 'actions/tool.actions';

function mapStateToProps(state) {
  const { contexts } = state.tool;
  const contextsDict = contexts.reduce(
    (acc, ctx) => ({
      ...acc,
      [ctx.commodityName]: [
        ...(acc[ctx.commodityName] || []),
        { name: ctx.countryName, id: ctx.id }
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
