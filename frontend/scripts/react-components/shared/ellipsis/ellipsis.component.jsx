import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ellipsis.scss';
import ReactTooltip from 'react-tooltip';

// TODO: use export to get them directly from _settings.scss
const fontSizes = {
  small: 10,
  regular: 12,
  'x-regular': 13,
  'xx-regular': 16,
  'xxx-regular': 18,
  medium: 20,
  big: 24,
  'x-big': 32,
  huge: 48
};
const HEIGHT_TO_WIDTH_FONT_RATIO = 0.75;

function Ellipsis(props) {
  const { charLimit, lineLimit, children, fontSize } = props;
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [ref]);

  const getLines = text => (text.length * fontSizes[fontSize] * HEIGHT_TO_WIDTH_FONT_RATIO) / width;

  if (lineLimit && getLines(String(children)) < lineLimit + 1) {
    return children;
  }
  if (String(children).length < charLimit + 1) {
    return children;
  }
  return (
    <span ref={ref} data-tip={children} className="c-ellipsis">
      {`${children.substring(0, charLimit)} ...`}
      <ReactTooltip type="light" className="c-ellipsis-tooltip" />
    </span>
  );
}

Ellipsis.propTypes = {
  charLimit: PropTypes.number,
  lineLimit: PropTypes.number,
  fontSize: PropTypes.string,
  children: PropTypes.node
};

Ellipsis.defaultProps = {
  charLimit: 30,
  lineLimit: null,
  fontSize: 'regular'
};

export default Ellipsis;
