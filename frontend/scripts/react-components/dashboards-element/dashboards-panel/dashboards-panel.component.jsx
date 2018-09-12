import React from 'react';
// import PropTypes from 'prop-types';
import SearchInput from 'react-components/shared/search-input.component';
import BlockSwitch from 'react-components/shared/block-switch.component';
import GridList from 'react-components/shared/grid-list.component';
import cx from 'classnames';

class DashboardsPanel extends React.PureComponent {
  state = {
    activeBlockId: null,
    activeItem: null
  };

  blocks = [
    { id: 'sourcing', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];

  items = [
    { value: 'tupac' },
    { value: 'kanye' },
    { value: 'eminem' },
    { value: 'biggie' },
    { value: 'jay z' },
    { value: 'drake' }
  ];

  render() {
    const { activeBlockId, activeItem } = this.state;

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
              width={600}
              columnWidth={180}
              rowHeight={50}
              columnCount={3}
              items={this.items}
            >
              {({ item, style, isGroup }) => {
                if (!item) return <b style={style} />;
                return (
                  <div style={style} className="c-grid-list-item">
                    {isGroup && <p>{item.value}</p>}
                    {!isGroup && (
                      <button
                        onClick={() => this.setState({ activeItem: item.value })}
                        className={cx('grid-list-item-content', {
                          '-active': item.value === activeItem,
                          '-header': isGroup
                        })}
                      >
                        <p>{item.value}</p>
                      </button>
                    )}
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
