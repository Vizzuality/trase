import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getDashboardsPanelData,
  setDashboardsPanelActiveId
} from 'react-components/dashboards-element/dashboards-element.actions';
import DashboardsPanel from 'react-components/dashboards-element/dashboards-panel/dashboards-panel.component';
import {
  getDashboardsPanels,
  getDirtyBlocks,
  getDynamicSentence
} from 'react-components/dashboards-element/dashboards-panel/dashboards-panel.selectors';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
  const {
    data: { jurisdictions, countries, commodities, companies }
  } = state.dashboardsElement;
  return {
    countries,
    companies,
    commodities,
    jurisdictions,
    dirtyBlocks: getDirtyBlocks(state),
    dynamicSentenceParts: getDynamicSentence(state),
    ...getDashboardsPanels(state)
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getData: getDashboardsPanelData,
      setActiveId: setDashboardsPanelActiveId
    },
    dispatch
  );

class DashboardsPanelContainer extends React.PureComponent {
  static propTypes = {
    dirtyBlocks: PropTypes.object,
    getData: PropTypes.func.isRequired,
    setCanCloseModal: PropTypes.func.isRequired
  };

  state = {
    activePanelId: null
  };

  panels = [
    { id: 'sourcing', title: 'sourcing places' },
    { id: 'importing', title: 'importing countries' },
    { id: 'companies', title: 'companies' },
    { id: 'commodities', title: 'commodities' }
  ];

  tabs = {
    jurisdictions: ['biome', 'state', 'municipality'],
    companies: ['importers', 'exporters']
  };

  componentDidMount() {
    const { dirtyBlocks, setCanCloseModal } = this.props;
    if (dirtyBlocks) {
      setCanCloseModal(true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { activePanelId } = this.state;
    const { dirtyBlocks, setCanCloseModal } = this.props;
    if (prevState.activePanelId !== activePanelId) {
      this.props.getData(activePanelId);
    }

    if (prevProps.dirtyBlocks !== dirtyBlocks && dirtyBlocks) {
      setCanCloseModal(true);
    }
  }

  setActivePanel = activePanelId => {
    this.setState({ activePanelId });
  };

  render() {
    const { activePanelId } = this.state;
    return (
      <DashboardsPanel
        tabs={this.tabs}
        panels={this.panels}
        setActivePanel={this.setActivePanel}
        activePanelId={activePanelId}
        {...this.props}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardsPanelContainer);
