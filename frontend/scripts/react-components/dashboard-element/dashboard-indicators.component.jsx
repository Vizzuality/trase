/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import DashboardModalFooter from 'react-components/dashboard-element/dahsboard-modal-footer.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

const list = [
  { group: true, name: 'East Coast' },
  { name: 'tupac' },
  { name: 'kanye' },
  { name: 'eminem' },
  { group: true, name: 'West Coast' },
  { name: 'biggie' },
  { name: 'jay z' },
  { name: 'drake' }
];

class DashboardIndicators extends React.PureComponent {
  state = {
    activeItemInfo: null
  };

  componentDidMount() {
    document.body.classList.add('tooltip-modal');
  }

  componentWillUnmount() {
    document.body.classList.remove('tooltip-modal');
  }

  setActiveItemInfo = item => this.setState({ activeItemInfo: item.name });

  resetActiveItemInfo = () => {
    const { activeItemInfo } = this.state;
    if (activeItemInfo !== null) {
      this.setState({ activeItemInfo: null });
    }
  };

  render() {
    const { dynamicSentenceParts } = this.props;
    const { activeItemInfo } = this.state;
    return (
      <div className="c-dashboard-panel" onClick={this.resetActiveItemInfo}>
        <div className="dashboard-panel-content">
          <h2 className="dasboard-panel-title title -center -light">Indicators</h2>
          <GridList
            items={list}
            height={350}
            width={800}
            rowHeight={50}
            columnWidth={190}
            columnCount={4}
            groupBy="group"
          >
            {itemProps => (
              <GridListItem
                {...itemProps}
                tooltip="hehehe"
                isInfoActive={activeItemInfo === (itemProps.item && itemProps.item.name)}
                onInfoClick={this.setActiveItemInfo}
              />
            )}
          </GridList>
        </div>
        <DashboardModalFooter dynamicSentenceParts={dynamicSentenceParts} />
      </div>
    );
  }
}

DashboardIndicators.propTypes = {
  dynamicSentenceParts: PropTypes.array
};

export default DashboardIndicators;
