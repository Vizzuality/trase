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
    modalOpen: true,
    goBackOnCloseModal: true,
    step: DashboardElement.steps.WELCOME
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  updateStep = step => this.setState({ step });

  render() {
    const { step, modalOpen, goBackOnCloseModal } = this.state;
    const { dynamicSentenceParts, goToRoot } = this.props;
    return (
      <DashboardElement
        step={step}
        modalOpen={modalOpen}
        setStep={this.updateStep}
        goToRoot={goToRoot}
        goBackOnCloseModal={goBackOnCloseModal}
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
