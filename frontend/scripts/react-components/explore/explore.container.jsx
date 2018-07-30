import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { selectContextById } from 'actions/app.actions';
import Explore from './explore.component';

const mapStateToProps = state => {
  const { selectedYears } = state.tool;
  const { selectedContext, contextIsUserSelected } = state.app;
  const isSubnational = selectedContext ? selectedContext.isSubnational : null;

  return {
    isSubnational,
    selectedYears,
    selectedContext,
    showTable: contextIsUserSelected
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ selectContextById }, dispatch);

const TOP_NODES = gql`
  query($ctx: Int!, $start: Int!, $end: Int!, $col: Int!) {
    nodes(ctx: $ctx, start: $start, end: $end, col: $col)
      @rest(
        type: "TopNodes"
        path: "/contexts/:ctx/top_nodes?start_year=:start&end_year=:end&column_id=:col"
      ) {
      data
    }
  }
`;

class ExploreContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTableColumn: 6
    };
  }

  render() {
    const { selectedTableColumn } = this.state;
    const { showTable, selectedYears, selectedContext } = this.props;
    if (!selectedContext) return null;

    const params = {
      start: selectedYears[0],
      end: selectedYears[1],
      col: selectedTableColumn,
      ctx: selectedContext.id
    };
    return (
      <Query query={TOP_NODES} variables={params}>
        {({ loading, data: { nodes } }) => {
          const topNodes =
            !loading && nodes && nodes.data
              ? nodes.data.targetNodes.map(row => ({
                  ...row,
                  geoId: row.geo_id,
                  name:
                    selectedTableColumn === 8 && row.name === selectedContext.countryName
                      ? 'DOMESTIC CONSUMPTION'
                      : row.name
                }))
              : [];
          return (
            <Explore
              {...this.props}
              selectedTableColumn={selectedTableColumn}
              showTable={showTable}
              topExporters={topNodes}
              setSelectedTableColumn={col => this.setState({ selectedTableColumn: col })}
            />
          );
        }}
      </Query>
    );
  }
}

ExploreContainer.propTypes = {
  showTable: PropTypes.bool,
  selectedYears: PropTypes.array,
  selectedContext: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreContainer);
