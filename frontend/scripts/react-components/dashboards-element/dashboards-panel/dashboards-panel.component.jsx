import React from 'react';
// import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input.component';
import BlockSwitch from 'react-components/shared/block-switch.component';
import GridList from 'react-components/shared/grid-list.component';

class DashboardsPanel extends React.PureComponent {
  state = {
    activeBlockId: null
  };

  blocks = [
    { id: 'sourcing', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];

  items = [
    { value: 'tupac' },
    { value: 'eminem' },
    { value: 'drake' },
    { value: 'jay z' },
    { value: 'kanye' }
  ];

  render() {
    const { activeBlockId } = this.state;

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
          <React.Fragment>
            <SearchInput items={this.items} placeholder="search place" />
            <GridList
              height={150}
              width={300}
              columnWidth={100}
              rowHeight={35}
              columnCount={3}
              items={this.items}
            >
              {({ header, style, value }) => {
                if (header) {
                  return (
                    <div
                      style={{ ...style, width: '100%' }}
                      className="grid-item-container -header"
                    >
                      <div className="grid-item-header">{value}</div>
                    </div>
                  );
                }
                return (
                  <div style={style} className="grid-item-container">
                    <div className="grid-item">{value}</div>
                  </div>
                );
              }}
            </GridList>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default DashboardsPanel;
