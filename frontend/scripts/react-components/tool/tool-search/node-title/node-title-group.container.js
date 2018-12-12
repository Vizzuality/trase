import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectNode } from 'actions/tool.actions';
import NodeTitleGroup from 'react-components/tool/tool-search/node-title/node-title-group.component';
import { getSelectedNodesData } from 'react-components/tool/tool.selectors';

const mapStateToProps = state => {
  const { recolorGroups } = state.tool;
  const selectedNodesData = getSelectedNodesData(state.tool);
  const nodes = selectedNodesData.map(node => ({
    id: node.id,
    recolorGroup: recolorGroups === null || !recolorGroups[node.id] ? -1 : recolorGroups[node.id],
    columns: [{ title: node.type, content: node.name }]
  }));
  return {
    nodes
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onClose: nodeId => selectNode(nodeId)
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeTitleGroup);
