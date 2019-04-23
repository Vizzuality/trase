import React from 'react';
import PropTypes from 'prop-types';
import './ellipsis.scss';
import ReactTooltip from 'react-tooltip';

function Ellipsis(props) {
  const { charLimit, children } = props;
  if (String(children).length < charLimit) return children;
  return (
    <span data-tip={children} className="c-ellipsis">
      {`${children.substring(0, charLimit)} ...`}
      <ReactTooltip type="light" className="c-ellipsis-tooltip" />
    </span>
  );
}

Ellipsis.propTypes = {
  charLimit: PropTypes.number,
  children: PropTypes.node
};

Ellipsis.defaultProps = {
  charLimit: 30
};

export default Ellipsis;
