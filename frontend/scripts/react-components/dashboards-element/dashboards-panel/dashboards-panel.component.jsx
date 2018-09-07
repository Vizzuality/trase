import React from 'react';
import BlockSwitch from 'react-components/shared/block-switch.component';

function DashboardsPanel() {
  const blocks = [
    { id: 'sourcing', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];
  return (
    <div className="c-dashboards-panel">
      <h2 className="title -center -medium -light">
        Choose the options you want to add to the dashboard
      </h2>
      <BlockSwitch blocks={blocks} selectBlock={() => {}} activeBlockId={null} />
    </div>
  );
}

export default DashboardsPanel;
