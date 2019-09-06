import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GET_PROFILE_METADATA } from 'utils/getURLFromParams';
import { openModal } from 'react-components/shared/profile-selector/profile-selector.actions';
import Widget from 'react-components/widgets/widget.component';
import ProfileNode from 'react-components/profile-node/profile-node.component';

class ProfileNodeContainer extends React.PureComponent {
  static propTypes = {
    context: PropTypes.object,
    nodeId: PropTypes.number,
    selectedYear: PropTypes.number
  };

  render() {
    const { context, nodeId, selectedYear } = this.props;

    return (
      <Widget
        key={nodeId}
        query={[GET_PROFILE_METADATA]}
        params={[{ context_id: context.id, node_id: nodeId }]}
      >
        {({ data = {}, loading, error }) => {
          const profileMetadata = data[GET_PROFILE_METADATA];
          const { availableYears } = profileMetadata || {};
          const year =
            selectedYear || (availableYears && availableYears[availableYears.length - 1]);
          return (
            <ProfileNode
              {...this.props}
              errorMetadata={error}
              loadingMetadata={loading}
              profileMetadata={profileMetadata}
              year={year}
            />
          );
        }}
      </Widget>
    );
  }
}

function mapStateToProps(state) {
  const {
    query: { year: selectedYear, nodeId, print, contextId = 1 } = {},
    payload: { profileType }
  } = state.location;
  const { contexts } = state.app;
  const ctxId = contextId && parseInt(contextId, 10);
  const context = contexts.find(ctx => ctx.id === ctxId) || { id: ctxId };
  return {
    selectedYear,
    context,
    profileType,
    printMode: print && JSON.parse(print),
    nodeId: parseInt(nodeId, 10)
  };
}

const updateQueryParams = (profileType, query) => ({
  type: 'profileNode',
  payload: { query, profileType }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateQueryParams,
      openModal
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileNodeContainer);
