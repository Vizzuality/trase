import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GET_PROFILE_METADATA } from 'utils/getURLFromParams';
import { profileSelectorActions } from 'react-components/shared/profile-selector/profile-selector.register';
import Widget from 'react-components/widgets/widget.component';
import Profile from 'react-components/profile/profile.component';

class ProfileContainer extends React.PureComponent {
  static propTypes = {
    context: PropTypes.object,
    commodityId: PropTypes.number,
    nodeId: PropTypes.number,
    selectedYear: PropTypes.number
  };

  render() {
    const { context, nodeId, selectedYear, commodityId } = this.props;
    const contextProps = {};

    if (context) {
      contextProps.context_id = context.id;
    } else {
      contextProps.commodity_id = commodityId;
    }

    const params = { node_id: nodeId, selectedYear, ...contextProps };

    return (
      <Widget key={nodeId} query={[GET_PROFILE_METADATA]} params={[params]}>
        {({ data = {}, loading, error }) => {
          const profileMetadata = data[GET_PROFILE_METADATA];
          const { years } = profileMetadata || {};
          const year = selectedYear || (years && years[years.length - 1]);
          return (
            <Profile
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

// TODO: Refactor
function mapStateToProps(state) {
  const {
    query: { year: selectedYear, nodeId, print, contextId, commodityId } = {},
    payload: { profileType }
  } = state.location;

  const { contexts } = state.app;
  const { type: panelType } = state.profileSelector.panels;

  const props = {
    selectedYear,
    profileType,
    printMode: print && JSON.parse(print),
    nodeId: parseInt(nodeId, 10),
    contexts
  };

  if (panelType === 'destinations') {
    return { ...props, isImporterCountry: true, commodityId };
  }

  const ctxId = contextId && parseInt(contextId, 10);
  let context;

  if (ctxId && !commodityId) {
    context = contexts.find(ctx => ctx.id === ctxId) || { id: ctxId };

    props.context = context;
  } else if (ctxId && commodityId) {
    context = contexts.find(ctx => ctx.id === ctxId && ctx.commodityId === commodityId);

    // If we don't have a context (commodity changed)
    // Find old context then get context with old countryId and new commodityId
    if (!context) {
      const oldContext = contexts.find(ctx => ctx.id === ctxId);
      context = contexts.find(
        ctx => ctx.countryId === oldContext.countryId && ctx.commodityId === commodityId
      );
    }

    props.context = context;
  }

  if (commodityId) {
    props.commodityId = commodityId;
  }

  return props;
}

const updateQueryParams = (profileType, query) => {
  let updatedQuery = { ...query };
  if (query.activityInfo) {
    const { activity, commodityId, nodeId } = query.activityInfo;
    const activityInfo = { nodeId, commodityId };
    if (activity === 'exporter') {
      delete updatedQuery.contextId;
    }
    updatedQuery = { ...updatedQuery, ...activityInfo };
    delete updatedQuery.activityInfo;
  }
  return {
    type: 'profile',
    payload: { query: updatedQuery, profileType }
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateQueryParams,
      openModal: profileSelectorActions.openModal
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
