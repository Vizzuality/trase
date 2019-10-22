import { connect } from 'react-redux';
import DynamicSentenceComponent from 'react-components/dashboard-element-legacy/dashboard-widget/dynamic-sentence-widget/dynamic-sentence-widget.component';
import { makeAddIndicatorsPartToSentence } from 'react-components/dashboard-element-legacy/dashboard-widget/dynamic-sentence-widget/dynamic-sentence-widget.selectors';

function makeMapStateToProps() {
  const addIndicatorsPartToSentence = makeAddIndicatorsPartToSentence();
  const mapStateToProps = (state, ownProps) => ({
    dynamicSentenceParts: addIndicatorsPartToSentence(state, ownProps)
  });
  return mapStateToProps;
}

export default connect(makeMapStateToProps)(DynamicSentenceComponent);
