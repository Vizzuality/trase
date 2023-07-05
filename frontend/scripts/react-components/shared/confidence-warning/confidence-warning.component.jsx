import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';
import './confidence-warning.scss';

const ConfidenceWarning = ({ variant, noIcon }) => (
  <Text
    size={variant === 'selector' ? 'xs' : 'sm'}
    className={`warning warning-${variant}`}
    color="grey"
  >
    {!noIcon && (
      <svg className="icon warning-bell-icon">
        <use xlinkHref="#icon-warning-bell" />
      </svg>
    )}
    <div className="warning-text">
      <Text weight="bold" className="warning-bold" as="span">
        Note:{' '}
      </Text>
      This data is based on new methodological approaches and we welcome feedback.
    </div>
  </Text>
);

ConfidenceWarning.defaultProps = {
  variant: 'sankey',
  noIcon: false
};

ConfidenceWarning.propTypes = {
  variant: PropTypes.oneOf(['sankey', 'dashboard', 'profile']),
  noIcon: PropTypes.bool
};

export default ConfidenceWarning;
