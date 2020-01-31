import { connect } from 'react-redux';
import { toolLinksActions } from 'react-components/tool-links/tool-links.register';
import NodeTitleGroup from 'react-components/tool/tool-search/node-title-group/node-title-group.component';
import { getSelectedNodesData } from 'react-components/tool/tool.selectors';
import { getToolRecolorGroups } from 'react-components/tool-links/tool-links.selectors';

const mapStateToProps = state => {
  const recolorGroups = getToolRecolorGroups(state);
  const selectedNodesData = getSelectedNodesData(state);
  const { columns } = state.toolLinks.data;
  const nodes = selectedNodesData.map(node => ({
    id: node.id,
    recolorGroup: recolorGroups === null || !recolorGroups[node.id] ? -1 : recolorGroups[node.id],
    columns: [{ title: columns[node.columnId].name, content: node.name }]
  }));
  return {
    nodes
  };
};

const mapDispatchToProps = {
  onClose: toolLinksActions.selectNodes
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeTitleGroup);
