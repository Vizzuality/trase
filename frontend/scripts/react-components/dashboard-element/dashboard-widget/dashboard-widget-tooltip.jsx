import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text';
import ReactDOM from 'react-dom';

import 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip.scss';

const getTooltipValue = (meta, dataKey, payload) => {
  const { x, ...keys } = payload.payload || payload;
  const key = dataKey || Object.keys(keys)[0];
  let text = '';
  if (meta && meta[key]) {
    const { tooltip } = meta[key];
    if (tooltip.prefix) {
      text = `${tooltip.prefix} `;
    }
    // TODO use tooltip formatter
    text += payload[key] && payload[key].toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else if (meta && !meta[key]) {
    text = payload[key] && payload[key].toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  return text;
};

const getTooltipLabel = (meta, key, payload) => {
  let text = '';
  if (meta && meta[key]) {
    const { label } = meta[key];
    text = `${label} `;
  } else {
    text = payload.y ? `${payload.y} ` : `${payload.x} `;
  }
  return text;
};

const renderTooltipSuffix = (meta, dataKey, payload) => {
  const { x, ...keys } = payload.payload || payload;
  const key = dataKey || Object.keys(keys)[0];
  if (meta && meta[key]) {
    const { tooltip } = meta[key];
    return (
      <>
        {' '}
        <Text variant="mono" as="span" color="grey-faded">
          {tooltip.suffix || meta.yAxis.suffix}
        </Text>
      </>
    );
  }
  return null;
};

function DashboardWidgetTooltip(props) {
  const { payload, meta, viewBox, coordinate, containerRef } = props;
  const { height, width } = viewBox;
  const { x, y } = coordinate;
  const dataView = document.getElementById('data-view');
  const [destinationElement, setDestinationElement] = useState(null);
  const tooltipRef = useRef(null);
  useEffect(() => {
    setDestinationElement(document.getElementById('recharts-tooltip-portal'));
    return () => setDestinationElement(null);
  }, []);

  const scrollCorrection = containerRef?.current?.offsetTop - dataView.scrollTop;
  const top = y + height / 2 + scrollCorrection;
  const left =
    x +
    containerRef?.current?.offsetWidth +
    containerRef?.current?.offsetLeft -
    width / 2 -
    (tooltipRef?.current?.offsetWidth || 0);
  const isStackedBars = meta.x1 || meta.y1;
  const renderTooltip = () => (
    <div className="c-dashboard-widget-tooltip" ref={tooltipRef} style={{ top, left }}>
      <div className="dashboard-widget-tooltip-header">
        <Text variant="mono" as="span" transform="uppercase">
          {payload[0] && (payload[0].unit || payload[0].payload?.y || payload[0].payload?.x)}
        </Text>
      </div>
      {isStackedBars && (
        <Text
          variant="mono"
          as="div"
          size="xs"
          transform="uppercase"
          color="grey-faded"
          className="dashboard-widget-tooltip-main-label"
        >
          {meta.yAxis.label}
        </Text>
      )}
      {[...payload].reverse().map(item => (
        <div
          className={cx('dashboard-widget-tooltip-item', { 'stacked-bars': isStackedBars })}
          key={item.name}
        >
          {!isStackedBars && (
            <Text
              variant="mono"
              as="div"
              size="xs"
              transform="uppercase"
              color="grey-faded"
              className="dashboard-widget-tooltip-label"
            >
              {getTooltipLabel(meta, item.dataKey, item.payload)}
            </Text>
          )}
          <div className="dashboard-widget-tooltip-value-container">
            {isStackedBars && (
              <div>
                <span
                  className="dashboard-widget-tooltip-color-dot"
                  style={{
                    backgroundColor: item.color || (item.payload && item.payload.fill) || 'white'
                  }}
                />
                <Text
                  variant="mono"
                  as="span"
                  transform="uppercase"
                  className="dashboard-widget-tooltip-label"
                >
                  {getTooltipLabel(meta, item.dataKey, item.payload)}
                </Text>
              </div>
            )}
            <Text variant="mono" as="span" size={isStackedBars ? 'rg' : 'lg'}>
              {getTooltipValue(meta, item.dataKey, item.payload)}
              {renderTooltipSuffix(meta, item.dataKey, item.payload)}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );

  if (!payload[0]) return null;

  return destinationElement && ReactDOM.createPortal(renderTooltip(), destinationElement);
}

DashboardWidgetTooltip.defaultProps = {};

DashboardWidgetTooltip.propTypes = {
  payload: PropTypes.array,
  meta: PropTypes.object,
  viewBox: PropTypes.shape({ height: PropTypes.number, width: PropTypes.number }),
  coordinate: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  containerRef: PropTypes.instanceOf(Element)
};

export default DashboardWidgetTooltip;
