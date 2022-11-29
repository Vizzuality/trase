import React from 'react';
import PropTypes from 'prop-types';
import wrapSVGText from 'utils/wrapSVGText';
import Link from 'redux-first-router-link';
import 'react-components/chart/tick/tick-styles.scss';

const renderText = tickValue => (
  <>
    <text className="tick-text">{wrapSVGText(tickValue, 10, 10, 15, 1)}</text>
    {tickValue.length > 15 && <title>{tickValue}</title>}
  </>
);

function CategoryTick(props) {
  const { x, y, payload, nodeIds, config } = props;
  const {
    dashboardMeta: { context }
  } = config;
  const node = nodeIds[payload.index];
  let url;

  if (node && node.profile && !DISABLE_PROFILES) {
    url = {
      type: 'profile',
      payload: { profileType: node.profile },
      query: { nodeId: node.id, contextId: context.id }
    };
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {url ? (
        <Link to={url} className="tick-text-link">
          {renderText(payload.value)}
        </Link>
      ) : (
        renderText(payload.value)
      )}
    </g>
  );
}

CategoryTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
  nodeIds: PropTypes.array,
  config: PropTypes.object
};

CategoryTick.defaultProps = {
  x: 0,
  y: 0,
  payload: {}
};

export default CategoryTick;
