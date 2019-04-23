import React from 'react';
import PropTypes from 'prop-types';
import './ellipsis.scss';
import ReactTooltip from 'react-tooltip';

function Ellipsis(props) {
  const { charsLimit, children } = props;
  if (String(children).length < charsLimit) return children;
  return (
    <span data-tip={children} className="c-ellipsis">
      {`${children.substring(0, charsLimit)} ...`}
      <ReactTooltip type="light" className="c-ellipsis-tooltip" />
    </span>
  );
}

Ellipsis.propTypes = {
  charsLimit: PropTypes.number,
  children: PropTypes.node
};

Ellipsis.defaultProps = {
  charsLimit: 30
};

export default Ellipsis;
