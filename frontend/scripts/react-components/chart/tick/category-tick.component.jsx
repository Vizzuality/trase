import React from 'react';
import PropTypes from 'prop-types';
import wrapSVGText from 'utils/wrapSVGText';
import 'react-components/chart/tick/tick-styles.scss';
import Tooltip from 'react-components/shared/tooltip';
import Icon from 'react-components/shared/icon';
import Text from 'react-components/shared/text';
import capitalize from 'lodash/capitalize';

const renderReference = tickValue => (
  <text x="0" y="3" fill="#fff" className="tick-text">
    {wrapSVGText(tickValue, 10, 10, 15, 1)}
  </text>
);

const renderText = (tickValue, id, url) =>
  tickValue.length <= 15 && !url ? (
    renderReference(tickValue)
  ) : (
    <Tooltip type="svg" reference={renderReference(tickValue)} destinationId={id}>
      <div className="tooltip-content">
        {tickValue.length > 15 && (
          <Text as="div" color="white" className="extended-tick-text">
            {capitalize(tickValue)}
          </Text>
        )}
        {url && (
          <div className="go-to-profile-text">
            <Text as="span" color="white">
              Go to Profile
            </Text>
            <Icon icon="icon-external-link-plain" />
          </div>
        )}
      </div>
    </Tooltip>
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
          {renderText(tickValue, id, url)}
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
