import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text/text.component';

import './recolor-by-legend.scss';

function RecolorByLegend(props) {
  const { recolorBy, recolorById } = props;
  console.log(props);
  return (
    <div className="c-recolor-by-legend">
      {recolorBy.minValue && (
        <Text as="span" size="sm" variant="mono" className="recolor-by-legend-unit -left">
          {recolorBy.minValue}
        </Text>
      )}
      {recolorBy.legendType && (
        <ul className={cx('recolor-by-legend-container', `-${recolorBy.legendType}`)}>
          {recolorBy.items?.map((legendItem, key) => (
            <li
              key={key}
              className={cx('recolor-by-legend-item', legendItem.className, {
                '-active': legendItem.value === recolorById || recolorById === null
              })}
            >
              <Text as="span" variant="mono" size="lg" className="recolor-by-legend-item-value">
                {legendItem.value}
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
  recolorById: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  recolorBy: PropTypes.object
};

export default RecolorByLegend;
