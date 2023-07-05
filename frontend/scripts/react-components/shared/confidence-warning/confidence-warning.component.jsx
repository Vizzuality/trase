import React from 'react';
import Text from 'react-components/shared/text';
import './confidence-warning.scss';

const ConfidenceWarning = () => (
  <Text className="warning" color="grey">
    <svg className="icon warning-bell-icon">
      <use xlinkHref="#icon-warning-bell" />
    </svg>
    <div className="warning-text">
      <Text weight="bold" className="warning-bold" as="span">
        Note:{' '}
      </Text>
      This dataset is experimental and we welcome feedback. Please refer to the methods to
      understand the modelling work and its limitations.
    </div>
  </Text>
);

export default ConfidenceWarning;
