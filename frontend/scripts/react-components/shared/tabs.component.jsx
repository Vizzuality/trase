import React from 'react';
import PropTypes from 'prop-types';

function Tabs(props) {
  const { tabs, onTabClick, children } = props;
  console.log(tabs);
  return (
    <div className="c-tabs">
      <div className="tabs-container">
        {tabs.map(tab => (
          <button className="tab-item" onClick={() => onTabClick(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div className="tabs-content">{children}</div>
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  onTabClick: PropTypes.func.isRequired
};

export default Tabs;
