import React from 'react';
import PropTypes from 'prop-types';
import TopDestinationsChartWidget from 'react-components/profile-node/profile-node-widgets/top-destinations-chart-widget.component';
import TopDestinationsMapWidget from 'react-components/profile-node/profile-node-widgets/top-destinations-map-widget.component';
import {
  GET_ACTOR_TOP_COUNTRIES,
  GET_ACTOR_TOP_SOURCES,
  GET_NODE_SUMMARY_URL
} from 'utils/getURLFromParams';
import Widget from 'react-components/widgets/widget.component';

class TopDestinationsWidget extends React.PureComponent {
  tabs = ['municipality', 'biome', 'state'];

  state = {
    activeTab: 'municipality'
  };

  getActiveTabProps(data) {
    const { type } = this.props;
    const { activeTab } = this.state;
    const linesData = type === 'countries' ? data : data[activeTab];
    const { includedYears, buckets } = data;
    const { lines, style, unit, profileType } = linesData;
    return { includedYears, lines, style, unit, profileType, buckets };
  }

  updateTab = index => this.setState({ activeTab: this.tabs[index] });

  render() {
    const { printMode, year, nodeId, contextId, type, className } = this.props;
    const { activeTab } = this.state;
    const mainQuery = type === 'countries' ? GET_ACTOR_TOP_COUNTRIES : GET_ACTOR_TOP_SOURCES;
    const params = { node_id: nodeId, context_id: contextId };
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[{ ...params, year }, { ...params, profile_type: 'actor' }]}
      >
        {({ data, loading }) => {
          if (loading) return null;
          const {
            includedYears,
            lines,
            unit,
            profileType,
            style,
            buckets
          } = this.getActiveTabProps(data[mainQuery]);
          const { nodeName, columnName } = data[GET_NODE_SUMMARY_URL];
          const verb = columnName === 'EXPORTER' ? 'exported' : 'imported';
          return (
            <section className={className}>
              <div className="row align-justify">
                <div className="column small-12 medium-6">
                  <TopDestinationsChartWidget
                    height={250}
                    type={type}
                    tabs={this.tabs}
                    onChangeTab={this.updateTab}
                    year={year}
                    includedYears={includedYears}
                    lines={lines}
                    unit={unit}
                    profileType={profileType}
                    style={style}
                    nodeName={nodeName}
                    columnName={columnName}
                    verb={verb}
                  />
                </div>
                <div className="column small-12 medium-6">
                  <TopDestinationsMapWidget
                    height={250}
                    year={year}
                    printMode={printMode}
                    verb={verb}
                    buckets={buckets}
                    lines={lines}
                    nodeName={nodeName}
                    activeTab={type === 'regions' && activeTab}
                    profileType={profileType}
                  />
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

TopDestinationsWidget.propTypes = {
  printMode: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default TopDestinationsWidget;
