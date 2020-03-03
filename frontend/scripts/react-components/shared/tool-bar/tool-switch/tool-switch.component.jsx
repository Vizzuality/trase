import React from 'react';
import PropTypes from 'prop-types';
import Tabs from 'react-components/shared/tabs';

import './tool-switch.scss';

function ToolSwitch({ dashboardSelected, switchTool }) {
  const tabs = [{ label: 'Flows', section: null }, { label: 'Data', section: 'data-view' }];
  const selected = dashboardSelected ? tabs[1] : tabs[0];
  const handleSelectTab = item => {
    if (item.label !== selected.label) {
      switchTool({ section: item.section });
    }
  };

  return (
    <div className="c-tool-switch">
      <Tabs
        tabs={tabs}
        margin={null}
        variant="toolbar"
        onSelectTab={handleSelectTab}
        selectedTab={selected}
        itemTabRenderer={t => t.label}
      />
    </div>
  );
}

ToolSwitch.propTypes = {
  dashboardSelected: PropTypes.bool,
  switchTool: PropTypes.func.isRequired
};

export default ToolSwitch;
