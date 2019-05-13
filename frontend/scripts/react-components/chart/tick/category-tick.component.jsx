import React from 'react';
import PropTypes from 'prop-types';
import wrapSVGText from 'utils/wrapSVGText';
import 'react-components/chart/tick/tick-styles.scss';
import Tooltip from 'react-components/shared/tooltip';

const renderText = (tickValue, id) => (
  <>
    <Tooltip
      type="svg"
      reference={wrapSVGText(tickValue, 10, 10, 15, 1)}
      referenceClassName="tick-text"
      destinationId={id}
    >
      {tickValue}
    </Tooltip>
  </>
);

function CategoryTick(props) {
  const { x, y, payload, nodeIds, config, id } = props;
  const tickValue = payload && payload.value;
  const nodeId = nodeIds.find(n => n.y === tickValue);
  let lastYear;
  let url;
  if (nodeId && nodeId.profile) {
    lastYear = config.years.end_year || config.years.start_year;
    url = `/profile-${nodeId.profile}?year=${lastYear}&nodeId=${nodeId.id}`;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {url ? (
        <a href={url} className="tick-text-link">
          {renderText(tickValue)}
        </a>
      ) : (
        renderText(tickValue, id)
      )}
    </g>
  );
}

CategoryTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({}),
  nodeIds: PropTypes.array,
  config: PropTypes.shape({}),
  id: PropTypes.string
};

CategoryTick.defaultProps = {
  x: 0,
  y: 0,
  payload: {}
};

export default CategoryTick;
