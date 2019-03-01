import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text';

import 'react-components/shared/steps-tracker/steps-tracker.scss';

function StepsTracker(props) {
  const { steps, activeStep } = props;
  return (
    <div className="c-steps-tracker">
      {steps.map((step, i) => (
        <>
          <div
            className={cx('steps-tracker-item', {
              '-active': i === activeStep,
              '-done': i < activeStep,
              '-pending': i > activeStep
            })}
          >
            <div className="steps-tracker-label">
              <Text as="span" variant="mono" transform="uppercase" weight="bold">
                {step.label}
              </Text>
            </div>
            <div className="steps-tracker-circle" />
            {i < steps.length - 1 && <div className="steps-tracker-segment" />}
          </div>
        </>
      ))}
    </div>
  );
}

StepsTracker.propTypes = {
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired
};

export default StepsTracker;
