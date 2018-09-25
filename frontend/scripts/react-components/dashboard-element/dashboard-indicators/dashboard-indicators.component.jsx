/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import DashboardModalFooter from 'react-components/dashboard-element/dahsboard-modal-footer.component';
import GridList from 'react-components/shared/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item.component';

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
    const {
      goBack,
      indicators,
      onContinue,
      setActiveId,
      removeActiveId,
      activeIndicatorsList,
      dynamicSentenceParts
    } = this.props;
    const { activeItemInfo } = this.state;
    return (
      <div className="c-dashboard-panel" onClick={this.resetActiveItemInfo}>
        <div className="dashboard-panel-content">
          <h2 className="dasboard-panel-title title -center -light">Indicators</h2>
          <GridList
            items={indicators}
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
                enableItem={setActiveId}
                disableItem={removeActiveId}
                isActive={activeIndicatorsList.find(
                  indicator => indicator.name === (itemProps.item && itemProps.item.name)
                )}
                isInfoActive={activeItemInfo === (itemProps.item && itemProps.item.name)}
                onInfoClick={this.setActiveItemInfo}
              />
            )}
          </GridList>
        </div>
        <DashboardModalFooter
          onBack={goBack}
          onContinue={onContinue}
          isDisabled={activeIndicatorsList.length === 0}
          dynamicSentenceParts={dynamicSentenceParts}
        />
      </div>
    );
  }
}

DashboardIndicators.propTypes = {
  indicators: PropTypes.array,
  setActiveId: PropTypes.func,
  removeActiveId: PropTypes.func,
  goBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  activeIndicatorsList: PropTypes.array,
  dynamicSentenceParts: PropTypes.array
};

export default DashboardIndicators;
