import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
    if (tooltip.suffix || (meta.yAxis && meta.yAxis.suffix)) {
      // TODO temporary fallback, suffix should be taken from tooltip always
      const suffix = tooltip.suffix || meta.yAxis.suffix;
      text += ` ${suffix}`;
    }
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

function DashboardWidgetTooltip(props) {
  const { payload, meta, viewBox, coordinate, containerRef } = props;
  const { left: viewBoxLeft, height, width } = viewBox;
  const { x, y } = coordinate;
  const dataView = document.getElementById('data-view');
  const [destinationElement, setDestinationElement] = useState(null);

  useEffect(() => {
    setDestinationElement(document.getElementById('recharts-tooltip-portal'));
    return () => setDestinationElement(null);
  }, []);

  const scrollCorrection = containerRef?.current?.offsetTop - dataView.scrollTop;
  const top = y + height / 2 + scrollCorrection;
  let left = viewBoxLeft + x + width / 2 + containerRef?.current?.offsetLeft;
  left =
    left - containerRef?.current?.offsetLeft > containerRef?.current?.offsetWidth
      ? viewBoxLeft + x + containerRef?.current?.offsetLeft
      : left;

  const renderTooltip = () => (
    <div className="c-dashboard-widget-tooltip" style={{ top, left }}>
      <div className="dashboard-widget-tooltip-header">
        <Text
          variant="mono"
          as="span"
          color="white"
          weight="bold"
          className="dashboard-widget-tooltip-unit"
        >
          {payload[0] && payload[0].unit}
        </Text>
      </div>
      {[...payload].reverse().map(item => (
        <div className="dashboard-widget-tooltip-item" key={item.name}>
          <div>
            <span
              className="dashboard-widget-tooltip-color-line"
              style={{
                backgroundColor: item.color || (item.payload && item.payload.fill) || 'white'
              }}
            />
            <Text
              variant="mono"
              as="span"
              color="white"
              weight="bold"
              className="dashboard-widget-tooltip-label"
            >
              {getTooltipLabel(meta, item.dataKey, item.payload)}
            </Text>
          </div>
          <Text
            variant="mono"
            as="span"
            color="white"
            weight="bold"
            className="dashboard-widget-tooltip-value"
          >
            {getTooltipValue(meta, item.dataKey, item.payload)}
          </Text>
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
  meta: PropTypes.object
};

export default DashboardWidgetTooltip;
