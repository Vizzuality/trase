import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import DashboardElement from 'react-components/dashboard-element/dashboard-element.component';
import {
  getDashboardFiltersProps,
  getDashboardGroupedCharts
} from 'react-components/dashboard-element/dashboard-element.selectors';

const mapStateToProps = state => ({
  loading: state.dashboardElement.loading,
  groupedCharts: getDashboardGroupedCharts(state),
  filters: getDashboardFiltersProps(state)
});

function DashboardElementContainer(props) {
  const { loading, groupedCharts, filters } = props;
  return <DashboardElement loading={loading} filters={filters} groupedCharts={groupedCharts} />;
}

DashboardElementContainer.propTypes = {
  loading: PropTypes.bool,
  filters: PropTypes.object,
  groupedCharts: PropTypes.object
};

export default connect(mapStateToProps)(DashboardElementContainer);
