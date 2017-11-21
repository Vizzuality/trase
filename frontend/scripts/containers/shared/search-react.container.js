import { connect } from 'preact-redux';
import Search from 'react-components/shared/search.component.js';
import _ from 'lodash';


const mapStateToProps = (state) => {
  return {
    nodes: state.tool.nodesDict
  }
  // return {
  //   nodes: _.values(state.tool.nodesDict)
  //     .filter(
  //       node => node.hasFlows === true &&
  //       node.isAggregated !== true &&
  //       node.isUnknown !== true
  //     )
  // };
};

export default connect(
  mapStateToProps
)(Search);
