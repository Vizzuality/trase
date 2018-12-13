/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import DashboardModalFooter from 'react-components/dashboard-element/dashboard-modal-footer/dashboard-modal-footer.component';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import Spinner from 'scripts/react-components/shared/shrinking-spinner/shrinking-spinner.component';

import 'scripts/react-components/dashboard-element/dashboard-panel/dashboard-panel.scss';

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

  setActiveItemInfo = item => this.setState({ activeItemInfo: item.id });

  resetActiveItemInfo = () => {
    const { activeItemInfo } = this.state;
    if (activeItemInfo !== null) {
      this.setState({ activeItemInfo: null });
    }
  };

  render() {
    const {
      editMode,
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
        <div className="dashboard-indicators-content">
          <h2 className="dashboard-panel-title title -center -light -small">
            {editMode
              ? 'Edit indicators'
              : 'Select the indicators you want to analyse for the selections you have made'}
          </h2>
          {indicators.length === 0 && (
            <div className="widget-spinner">
              <Spinner className="-large -dark" />
            </div>
          )}
          <GridList
            className="dashboard-panel-pill-list"
            items={indicators}
            height={350}
            width={950}
            rowHeight={50}
            columnWidth={316}
            columnCount={3}
            groupBy="group"
          >
            {itemProps => (
              <GridListItem
                {...itemProps}
                tooltip={itemProps.item && itemProps.item.tooltipText}
                enableItem={setActiveId}
                disableItem={removeActiveId}
                isDisabled={!!itemProps.item && itemProps.item.isDisabled}
                isActive={activeIndicatorsList.includes(itemProps.item && itemProps.item.id)}
                isInfoActive={activeItemInfo === (itemProps.item && itemProps.item.id)}
                onInfoClick={this.setActiveItemInfo}
              />
            )}
          </GridList>
        </div>
        <DashboardModalFooter
          editMode={editMode}
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
  editMode: PropTypes.bool.isRequired,
  indicators: PropTypes.array,
  setActiveId: PropTypes.func,
  removeActiveId: PropTypes.func,
  goBack: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  activeIndicatorsList: PropTypes.array,
  dynamicSentenceParts: PropTypes.array
};

export default DashboardIndicators;
