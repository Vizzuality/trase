import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text/text.component';
import capitalize from 'lodash/capitalize';

import './recolor-by-legend.scss';

function RecolorByLegend(props) {
  const { recolorBy, value } = props;
  const valueSize = recolorBy.legendType === 'qual' ? 'lg' : 'sm';
  const valueWeight = recolorBy.legendType === 'qual' ? undefined : 'bold';
  let displayValue = value - 1;
  let bucketValue = value - 1;
  if (recolorBy.type !== 'ind') {
    displayValue = value;
    bucketValue = value;
  } else if (recolorBy.legendType === 'percentual') {
    // percentual values are always a range, not the raw value.
    // The value coming from the model is already floored
    // to the start of the bucket (splitLinksByColumn)
    const nextValue = value + recolorBy.divisor;
    displayValue = `${value}–${nextValue}%`;
    bucketValue = Math.floor(value / recolorBy.divisor);
  }
  return (
    <div className={cx('c-recolor-by-legend', `-${recolorBy.legendType}`)}>
      {recolorBy.minValue && (
        <Text as="span" size="sm" variant="mono" className="recolor-by-legend-unit -left">
          {recolorBy.minValue}
        </Text>
      )}
      {recolorBy.legendType && (
        <ul className="recolor-by-legend-container">
          {recolorBy.items?.map((legendItem, key) => (
            <li
              key={key}
              className={cx('recolor-by-legend-item', legendItem.className, {
                '-active': legendItem.value === bucketValue
              })}
            >
              <Text
                as="span"
                variant="mono"
                size={valueSize}
                weight={valueWeight}
                className="recolor-by-legend-item-value"
              >
                {capitalize(displayValue)}
              </Text>
            </li>
          ))}
        </ul>
      )}
      {recolorBy.maxValue && (
        <Text as="span" size="sm" variant="mono" className="recolor-by-legend-unit -right">
          {recolorBy.maxValue}
        </Text>
      )}
    </div>
  );
}

RecolorByLegend.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  recolorBy: PropTypes.object
};

export default RecolorByLegend;
