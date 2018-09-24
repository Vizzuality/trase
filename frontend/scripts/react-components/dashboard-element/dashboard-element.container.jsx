import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import { getDynamicSentence } from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.selectors';

const mapStateToProps = state => ({
  dynamicSentenceParts: getDynamicSentence(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      goToRoot: () => ({ type: 'dashboardRoot' })
    },
    dispatch
  );

class DashboardElementContainer extends React.Component {
  static propTypes = {
    goToRoot: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array
  };

  state = {
    step: 0,
    goBackOnCloseModal: true,
    modalOpen: true
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
    if (this.state.goBackOnCloseModal) {
      this.props.goToRoot();
    }
  };

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen } = this.state;
    const { dynamicSentenceParts } = this.props;
    return (
      <DashboardElement
        step={step}
        modalOpen={modalOpen}
        setStep={this.updateStep}
        closeModal={this.closeModal}
        dynamicSentenceParts={dynamicSentenceParts}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardElementContainer);
