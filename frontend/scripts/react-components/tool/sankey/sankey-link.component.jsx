import React from 'react';
import PropTypes from 'prop-types';
import { interpolateNumber } from 'd3-interpolate';
import { DETAILED_VIEW_MIN_LINK_HEIGHT } from 'constants';

function SankeyLink(props) {
  const { link, onMouseOver, onMouseOut, className } = props;

  const getLink = _link => {
    const x0 = _link.x;
    const x1 = _link.x + _link.width;
    const xi = interpolateNumber(x0, x1);
    const x2 = xi(0.75);
    const x3 = xi(0.25);
    const y0 = _link.sy + _link.renderedHeight / 2;
    const y1 = _link.ty + _link.renderedHeight / 2;
    return `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`;
  };

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <path
      d={getLink(link)}
      className={className}
      onMouseOut={onMouseOut}
      onMouseOver={e => onMouseOver(e, link)}
      strokeWidth={Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, link.renderedHeight)}
    />
  );
}

SankeyLink.propTypes = {
  link: PropTypes.object.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
};

export default SankeyLink;
