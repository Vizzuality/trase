import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import PropTypes from 'prop-types';
import {
  addActiveIndicator,
  removeActiveIndicator
} from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardIndicators from 'react-components/dashboard-element/dashboard-indicators/dashboard-indicators.component';
import {
  getDynamicSentence,
  getIndicatorsByGroup
} from 'react-components/dashboard-element/dashboard-element.selectors';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setActiveId: addActiveIndicator,
      removeActiveId: removeActiveIndicator
    },
    dispatch
  );

const mapStateToProps = state => ({
  dynamicSentenceParts: getDynamicSentence(state),
  indicators: getIndicatorsByGroup(state),
  activeIndicatorsList: state.dashboardElement.activeIndicatorsList
});

class DashboardIndicatorsContainer extends React.PureComponent {
  static propTypes = {
    indicators: PropTypes.array,
    activeIndicatorsList: PropTypes.array,
    dynamicSentenceParts: PropTypes.array,
    setActiveId: PropTypes.func.isRequired,
    removeActiveId: PropTypes.func.isRequired
  };

  render() {
    return <DashboardIndicators {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardIndicatorsContainer);
