import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text';

import 'react-components/shared/steps-tracker/steps-tracker.scss';

function StepsTracker(props) {
  const { steps, activeStep, onSelectStep } = props;
  const ItemComponent = itemProps =>
    onSelectStep && !itemProps.isActive ? (
      <button onClick={() => onSelectStep(itemProps.stepIndex + 1)} className={itemProps.className}>
        {itemProps.children}
      </button>
    ) : (
      <div className={itemProps.className}>{itemProps.children}</div>
    );

  return (
    <div className="c-steps-tracker">
      {steps.map((step, i) => {
        const isDone = i < activeStep;
        const isActive = i === activeStep;
        return (
          <div
            key={step.label}
            className={cx('steps-tracker-item-wrapper', {
              '-pending': !onSelectStep && i > activeStep,
              '-done': isDone,
              '-selectable': onSelectStep,
              '-active': isActive
            })}
          >
            <ItemComponent stepIndex={i} isActive={isActive} className="steps-tracker-item">
              <div className={cx('steps-tracker-label', { '-choose-step': activeStep < 0 })}>
                <Text as="span" variant="sans" transform="uppercase" weight="bold">
                  {step.label}
                </Text>
              </div>
              <div className="steps-tracker-circle">
                <span className="steps-tracker-circle-dot" />
              </div>
            </ItemComponent>
            {i < steps.length - 1 && <div className="steps-tracker-segment" />}
          </div>
        );
      })}
    </div>
  );
}

StepsTracker.propTypes = {
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired,
  onSelectStep: PropTypes.func
};

export default StepsTracker;
