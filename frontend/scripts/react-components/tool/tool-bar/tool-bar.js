import { connect } from 'react-redux';
import ToolBar from './tool-bar.component';
import { getToolBar } from './tool-bar.selectors';

const mapStateToProps = state => {
  const { left, right } = getToolBar(state);
  return {
    leftSlot: left,
    rightSlot: right
  };
};

export default connect(mapStateToProps)(ToolBar);
