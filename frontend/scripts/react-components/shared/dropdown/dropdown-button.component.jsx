import React from 'react';
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
      column: { variant: 'mono', size: 'sm' },
      panel: { size: 'rg', variant: 'mono', transform: 'uppercase' }
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
        variant="mono"
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

export default DropdownButton;
