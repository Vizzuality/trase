import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text/text.component';

import './tabs.scss';

function Tabs(props) {
  const {
    tabs,
    margin,
    onSelectTab,
    children,
    itemTabRenderer,
    selectedTab,
    testId,
    getTabId,
    color,
    variant,
    disabled,
    actionComponent
  } = props;
  const isSelected = item => getTabId(item) === selectedTab;
  const variantText = {
    'plain-text': {
      color: 'grey'
    }
  }[variant];
  return (
    <div className={cx('c-tabs', { [`margin-${margin}`]: margin, [`v-${variant}`]: variant })}>
      <div className="tabs-container">
        <div className="tabs-options">
          {tabs.map((item, index) => (
            <button
              key={index}
              className={cx('tab', {
                '-selected': isSelected(item),
                [color]: !!color
              })}
              data-key={itemTabRenderer ? itemTabRenderer(item, index) : item}
              onClick={() => onSelectTab(item, index)}
              data-test={`${testId}-item`}
              disabled={disabled || isSelected(item)}
            >
              <Text
                as="span"
                color={isSelected(item) ? variantText?.color || color : 'grey'}
                weight="bold"
                size="rg"
                variant="mono"
              >
                {itemTabRenderer ? itemTabRenderer(item, index) : item}
              </Text>
            </button>
          ))}
        </div>
        {actionComponent}
      </div>
      {children && <div className="tabs-content">{children}</div>}
    </div>
  );
}

Tabs.defaultProps = {
  testId: 'tab',
  getTabId: x => x,
  color: 'white',
  margin: 'sm'
};

Tabs.propTypes = {
  testId: PropTypes.string,
  margin: PropTypes.string,
  getTabId: PropTypes.func,
  disabled: PropTypes.bool,
  itemTabRenderer: PropTypes.func,
  tabs: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])).isRequired,
  children: PropTypes.any,
  onSelectTab: PropTypes.func.isRequired,
  color: PropTypes.string,
  variant: PropTypes.string,
  actionComponent: PropTypes.node,
  selectedTab: PropTypes.any
};

export default Tabs;
