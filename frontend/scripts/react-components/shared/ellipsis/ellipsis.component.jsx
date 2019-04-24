import React from 'react';
import PropTypes from 'prop-types';
import './ellipsis.scss';
import Tooltip from 'react-components/shared/tooltip';

function Ellipsis(props) {
  const { charLimit, children } = props;
  if (String(children).length < charLimit) return children;
  return <Tooltip reference={`${children.substring(0, charLimit)} ...`}>{children}</Tooltip>;
}

Ellipsis.propTypes = {
  charLimit: PropTypes.number,
  children: PropTypes.node
};

Ellipsis.defaultProps = {
  charLimit: 30
};

export default Ellipsis;
