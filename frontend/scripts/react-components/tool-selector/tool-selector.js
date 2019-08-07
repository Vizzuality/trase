import { connect } from 'react-redux';
import ToolSelectorComponent from 'react-components/tool-selector/tool-selector.component';
import { getItems, getStep } from 'react-components/tool-selector/tool-selector.selectors';

const mapStateToProps = state => ({
  items: getItems(state),
  step: getStep(state)
});

export default connect(mapStateToProps)(ToolSelectorComponent);
