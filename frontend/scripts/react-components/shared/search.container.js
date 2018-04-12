import { selectExpandedNode, selectNode, setSankeySearchVisibility } from 'actions/tool.actions';
import { setSearch } from 'actions/app.actions';
import camelcase from 'lodash/camelCase';
import ToolSearch from 'react-components/tool/tool-search/tool-search.component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  const { search } = state.app;

  return {
    nodes: search.results.map(n => ({
      id: n.id,
      name: n.name,
      contextId: n.contextId,
      profileType: n.profile,
      type: n.nodeType
    }))
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onAddNode: nodeId => selectExpandedNode(nodeId),
      onRemoveNode: nodeId => selectNode(nodeId),
      setSankeySearchVisibility: searchVisibility => setSankeySearchVisibility(searchVisibility),
      navigateToActor: (profileType, nodeId) => ({
        type: camelcase(`profile-${profileType}`),
        payload: { query: { nodeId } }
      }),
      onInputValueChange: inputValue => setSearch(inputValue)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ToolSearch);
