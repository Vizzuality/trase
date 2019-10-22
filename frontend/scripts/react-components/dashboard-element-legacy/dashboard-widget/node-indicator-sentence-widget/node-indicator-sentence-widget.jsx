import { connect } from 'react-redux';
import NodeIndicatorSentenceWidget from 'react-components/dashboard-element-legacy/dashboard-widget/node-indicator-sentence-widget/node-indicator-sentence-widget.component';
import { makeGetNodeIndicatorSentenceParts } from 'react-components/dashboard-element-legacy/dashboard-widget/node-indicator-sentence-widget/node-indicator-sentence-widget.selectors';

function makeMapStateToProps() {
  const getNodeIndicatorSentenceParts = makeGetNodeIndicatorSentenceParts();
  const mapStateToProps = (state, ownProps) => ({
    nodeIndicatorSentenceParts: getNodeIndicatorSentenceParts(state, ownProps)
  });
  return mapStateToProps;
}

export default connect(makeMapStateToProps)(NodeIndicatorSentenceWidget);
