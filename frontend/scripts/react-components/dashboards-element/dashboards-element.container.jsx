import React from 'react';
import DashboardsElement from 'react-components/dashboards-element/dashboards-element.component';

class DashboardsElementContainer extends React.Component {
  state = {
    step: 0
  };

  render() {
    const { step } = this.state;
    return <DashboardsElement step={step} setStep={s => this.setState({ step: s })} />;
  }
}

export default DashboardsElementContainer;
