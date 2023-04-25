import React from 'react';
import './chart-error-styles.scss';
import Text from 'react-components/shared/text';

function ChartError() {
  return (
    <div className="row">
      <div className="small-12 columns large-10">
        <div className="c-chart-error">
          <img src="/images/profiles/error.svg" alt="Error" />
          <Text size="lg" align="center" className="error-text">
            The current chart is not visible because of data unavailability.
          </Text>
        </div>
      </div>
    </div>
  );
}

ChartError.propTypes = {};

export default ChartError;
