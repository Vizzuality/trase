import React from 'react';
import PropTypes from 'prop-types';
import Text from 'react-components/shared/text';

function DynamicSentenceWidget({ data, config }) {
  const { yAxisLabel } = config;
  return (
    <Text color="white" weight="bold" variant="mono" size="lg">
      {`${yAxisLabel.text} is ${data[0].y0} ${yAxisLabel.suffix}`}
    </Text>
  );
}

DynamicSentenceWidget.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object
};

export default DynamicSentenceWidget;
