import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { GET_ACTOR_TOP_COUNTRIES, GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import ActorLineChart from 'react-components/profile-node/actor-line-chart';

function TopDestinationsWidget(props) {
  const { printMode, year, nodeId, contextId } = props;
  const params = { node_id: nodeId, context_id: contextId };
  return (
    <Widget
      query={[GET_ACTOR_TOP_COUNTRIES, GET_NODE_SUMMARY_URL]}
      params={[{ ...params, year }, { ...params, profile_type: 'actor' }]}
    >
      {({ data, loading }) => {
        if (loading) return null;
        const allData = { ...data[GET_ACTOR_TOP_COUNTRIES], ...data[GET_NODE_SUMMARY_URL] };
        return <ActorLineChart data={allData} printMode={printMode} year={year} />;
      }}
    </Widget>
  );
}

TopDestinationsWidget.propTypes = {
  printMode: PropTypes.bool,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default TopDestinationsWidget;
