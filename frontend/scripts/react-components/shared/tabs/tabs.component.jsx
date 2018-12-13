import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './tabs.scss';

function Tabs(props) {
  const { tabs, onSelectTab, children, itemTabRenderer, selectedTab, testId, getTabId } = props;
  return (
    <div className="c-tabs">
      <div className="tabs-container">
        {tabs.map((item, index) => (
          <button
            key={index}
            className={cx('tab', {
              '-selected': getTabId(item) === selectedTab
            })}
            data-key={item}
            onClick={() => onSelectTab(item, index)}
            data-test={`${testId}-item`}
          >
            {itemTabRenderer ? itemTabRenderer(item, index) : item}
          </button>
        ))}
      </div>
      {children && <div className="tabs-content">{children}</div>}
    </div>
  );
}

Tabs.defaultProps = {
  testId: 'tab',
  getTabId: x => x
};

Tabs.propTypes = {
  testId: PropTypes.string,
  getTabId: PropTypes.func,
  itemTabRenderer: PropTypes.func,
  tabs: PropTypes.array.isRequired,
  children: PropTypes.any,
  onSelectTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Tabs;
