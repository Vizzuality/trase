import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import kebabCase from 'lodash/kebabCase';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text';

function DropdownButton(props) {
  const {
    innerRef,
    arrowType,
    inputValue,
    selectedValueOverride,
    label,
    size,
    color,
    tooltip,
    weight,
    variant,
    isDisabled,
    getToggleButtonProps
  } = props;

  const labelProps =
    {
      profiles: { size: 'rg', color: 'grey' },
      nav: { color: 'grey-faded' }
    }[variant] || {};

  const valueProps =
    {
      mono: { variant: 'mono' },
      column: { variant: 'sans', size: 'sm' },
      profiles: { variant: 'sans', weight: 'regular' },
      panel: { size: 'rg', variant: 'sans', transform: 'uppercase' },
      legend: { size: 'sm', variant: 'sans', transform: 'uppercase', color: 'grey-faded' }
    }[variant] || {};

  return (
    <button
      {...getToggleButtonProps({
        ref: innerRef,
        disabled: isDisabled,
        className: cx('dropdown-selected-item', {
          [`-${arrowType}`]: arrowType,
          '-no-label': !label
        }),
        'data-test': `dropdown-selected-item-${kebabCase(label)}`
      })}
    >
      <Text
        as="span"
        size="sm"
        variant="sans"
        color={color}
        transform="uppercase"
        {...labelProps}
        className="dropdown-label"
      >
        {label}
        {tooltip && <Tooltip text={tooltip} constraint="window" />}
      </Text>
      <Heading
        as="span"
        size={size}
        weight={weight}
        color={color}
        title={inputValue}
        {...valueProps}
        className="dropdown-value"
      >
        {selectedValueOverride || inputValue}
      </Heading>
    </button>
  );
}

DropdownButton.propTypes = {
  innerRef: PropTypes.any.isRequired,
  arrowType: PropTypes.string,
  inputValue: PropTypes.any,
  selectedValueOverride: PropTypes.any,
  label: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  tooltip: PropTypes.string,
  weight: PropTypes.string,
  variant: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  getToggleButtonProps: PropTypes.func.isRequired
};

export default React.memo(DropdownButton);
