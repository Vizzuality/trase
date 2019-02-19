import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Text from 'react-components/shared/text/text.component';

import './tabs.scss';

function Tabs(props) {
  const {
    tabs,
    onSelectTab,
    children,
    itemTabRenderer,
    selectedTab,
    testId,
    getTabId,
    color
  } = props;
  const isSelected = item => getTabId(item) === selectedTab;
  return (
    <div className="c-tabs">
      <div className="tabs-container">
        {tabs.map((item, index) => (
          <button
            key={index}
            className={cx('tab', {
              '-selected': isSelected(item),
              [color]: !!color
            })}
            data-key={item}
            onClick={() => onSelectTab(item, index)}
            data-test={`${testId}-item`}
            disabled={isSelected(item)}
          >
            <Text
              as="span"
              color={isSelected(item) ? color : 'grey'}
              weight="bold"
              size="rg"
              variant="mono"
            >
              {itemTabRenderer ? itemTabRenderer(item, index) : item}
            </Text>
          </button>
        ))}
      </div>
      {children && <div className="tabs-content">{children}</div>}
    </div>
  );
}

Tabs.defaultProps = {
  testId: 'tab',
  getTabId: x => x,
  color: 'white'
};

Tabs.propTypes = {
  testId: PropTypes.string,
  getTabId: PropTypes.func,
  itemTabRenderer: PropTypes.func,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.any,
  onSelectTab: PropTypes.func.isRequired,
  color: PropTypes.string,
  selectedTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Tabs;
