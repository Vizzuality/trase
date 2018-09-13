import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function Tabs(props) {
  const { tabs, onSelectTab, children, itemTabRenderer, selectedTab, testId } = props;
  return (
    <div className="c-tabs">
      <div className="tabs-container">
        {tabs.map((item, index) => (
          <button
            key={index}
            className={cx('tab', {
              '-selected': item === selectedTab
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
  testId: 'tab'
};

Tabs.propTypes = {
  testId: PropTypes.string,
  itemTabRenderer: PropTypes.func,
  tabs: PropTypes.array.isRequired,
  children: PropTypes.any.isRequired,
  onSelectTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired
};

export default Tabs;
