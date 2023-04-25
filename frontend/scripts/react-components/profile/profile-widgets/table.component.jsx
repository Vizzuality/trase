import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import Table from 'react-components/profile/profile-components/table/table.component';

import groupBy from 'lodash/groupBy';

import Heading from 'react-components/shared/heading/heading.component';
import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';
import ChartError from 'react-components/chart-error';

import { GET_COUNTRY_NODE_SUMMARY_URL } from 'utils/getURLFromParams';

class TableComponent extends React.PureComponent {
  renderSpinner() {
    return (
      <div className="section-placeholder">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  render() {
    const { nodeId, profileType, chart, title, commodityName, commodityId, year } = this.props;
    const params = { node_id: nodeId, commodity_id: commodityId, year };
    const chartUrl = chart.url;
    return (
      <Widget
        raw={[true, false]}
        query={[chartUrl, GET_COUNTRY_NODE_SUMMARY_URL]}
        params={[params, { ...params, profile_type: profileType }]}
      >
        {({ data, error, loading }) => {
          if (error) {
            console.error('Error loading summary data for profile page', error);
            return <ChartError />;
          }

          if (loading) {
            return this.renderSpinner();
          }

          const includedColumns = data[chartUrl].includedColumns;
          const tableData = data[chartUrl].rows;

          const groupByCommodity = groupBy(tableData, 'name');

          const serializedData = {
            includedColumns: [{ name: 'Commodity' }, ...includedColumns],
            highlight: {
              index: 0,
              value: commodityName
            },
            rows: []
          };

          Object.keys(groupByCommodity).forEach(commodity => {
            serializedData.rows.push([
              commodity,
              ...includedColumns.map((col, index) => groupByCommodity[commodity][0].values[index])
            ]);
          });

          return (
            <section className="page-break-inside-avoid c-profiles-table">
              <div className="row">
                <div className="small-12 columns">
                  <Heading variant="mono" weight="bold" size="md" as="h3">
                    <ProfileTitle
                      template={title}
                      summary={data[GET_COUNTRY_NODE_SUMMARY_URL]}
                      year={year}
                      commodityName={commodityName}
                    />
                  </Heading>
                  <div className="table-container page-break-inside-avoid">
                    <Table
                      type="t_head_top_imports"
                      title={title}
                      commodityName={commodityName}
                      contextId={commodityId}
                      data={serializedData}
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

TableComponent.propTypes = {
  title: PropTypes.string,
  commodityName: PropTypes.string,
  chart: PropTypes.object,
  year: PropTypes.number,
  nodeId: PropTypes.number,
  commodityId: PropTypes.number,
  profileType: PropTypes.string
};

export default TableComponent;
