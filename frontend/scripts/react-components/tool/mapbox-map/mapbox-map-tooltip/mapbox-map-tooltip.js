import { PropTypes } from 'prop-types';
import Tooltip from 'legacy/info-tooltip.component';
import { useEffect, useState } from 'react';

const MapTooltip = ({ data, values }) => {
  const [tooltip, setTooltip] = useState(null);
  useEffect(() => {
    setTooltip(new Tooltip('.js-node-tooltip'));
  }, []);

  useEffect(() => {
    if (tooltip) {
      if (data) {
        const { x, y, name } = data;
        tooltip.show(x, y, name, values || {});
      } else {
        tooltip.hide();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltip, data]);

  return null;
};

export default MapTooltip;

MapTooltip.propTypes = {
  data: PropTypes.object
};