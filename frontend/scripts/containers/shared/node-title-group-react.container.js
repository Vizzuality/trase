import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NodeTitleGroup from 'react-components/shared/node-title-group.component';
import { selectNode } from 'actions/tool.actions';

const mapStateToProps = (state) => {
  const { selectedNodesData, recolorGroups } = state.tool;
  const nodes = selectedNodesData.map(node => ({
    id: node.id,
    recolorGroup: (recolorGroups === null) || !recolorGroups[node.id] ? -1 : recolorGroups[node.id],
    columns: [{ title: node.type, content: node.name }]
  }));
  return {
    nodes
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  onClose: nodeId => selectNode(nodeId)
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeTitleGroup);
