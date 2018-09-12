import React from 'react';
// import PropTypes from 'prop-types';
import BlockSwitch from 'react-components/shared/block-switch.component';
import SourcingPanel from 'react-components/dashboards-element/dashboards-panel/sourcing-panel.component';

class DashboardsPanel extends React.PureComponent {
  state = {
    activeBlockId: null,
    activeItem: null,
    selectedTab: 'biome'
  };

  blocks = [
    { id: 'sourcing', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];

  items = [
    { name: 'tupac' },
    { name: 'kanye' },
    { name: 'eminem' },
    { name: 'biggie' }
    // { name: 'jay z' },
    // { name: 'drake' }
  ];

  tabs = ['biome', 'state'];

  render() {
    const { activeBlockId, activeItem, selectedTab } = this.state;

    return (
      <div className="c-dashboards-panel">
        <h2 className="title -center -medium -light">
          Choose the options you want to add to the dashboard
        </h2>
        <BlockSwitch
          blocks={this.blocks}
          selectBlock={id => this.setState({ activeBlockId: id })}
          activeBlockId={activeBlockId}
        />
        {activeBlockId === 'sourcing' && (
          <SourcingPanel
            activeItem={activeItem}
            selectedTab={selectedTab}
            items={this.items}
            tabs={this.tabs}
            onTabClick={tab => this.setState({ selectedTab: tab })}
            onSelectItem={item => this.setState({ activeItem: item.name })}
          />
        )}
      </div>
    );
  }
}

export default DashboardsPanel;
