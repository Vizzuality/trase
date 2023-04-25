import React from 'react';
import PropTypes from 'prop-types';
import { defaultMemoize } from 'reselect';
import Widget from 'react-components/widgets/widget.component';
import { GET_ACTOR_EXPORTING_COMPANIES, GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import Scatterplot from 'react-components/profile/profile-components/scatterplot/scatterplot.component';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import formatValue from 'utils/formatValue';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';
import ChartError from 'react-components/chart-error';

class ImportingCompaniesWidget extends React.PureComponent {
  state = {
    tooltipConfig: null
  };

  getDimensions = defaultMemoize((dimensionsX, companies) =>
    dimensionsX.filter((_, index) => companies.some(company => company.x[index] !== null))
  );

  getScatterplots(dimensionsX, title) {
    const { printMode } = this.props;
    if (printMode) {
      return dimensionsX.map(xDimension => ({
        title: <span data-unit={xDimension.unit}>{xDimension.name}</span>
      }));
    }

    return [{ title }];
  }

  onMouseMove = data => (company, indicator, x, y) => {
    const items = [
      {
        title: data.dimensionY.name,
        value: formatValue(company.y, data.dimensionY.name),
        unit: data.dimensionY.unit
      },
      {
        title: indicator.name,
        value: formatValue(company.x, indicator.name),
        unit: indicator.unit
      }
    ];
    const tooltipConfig = { x, y, text: company.name, items };
    this.setState(() => ({ tooltipConfig }));
  };

  onMouseLeave = () => {
    this.setState(() => ({ tooltipConfig: null }));
  };

  render() {
    const { year, nodeId, contextId, printMode, title, testId, commodityName } = this.props;
    const { tooltipConfig } = this.state;
    const params = { node_id: nodeId, context_id: contextId, year };
    return (
      <Widget
        query={[GET_ACTOR_EXPORTING_COMPANIES, GET_NODE_SUMMARY_URL]}
        params={[params, { ...params, profile_type: 'actor' }]}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div className="section-placeholder" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            // TODO: display a proper error message to the user
            console.error('Error loading importing companies data for profile page', error);
            return <ChartError />;
          }

          const { dimensionsX, companies, dimensionY } = data[GET_ACTOR_EXPORTING_COMPANIES];
          const summary = data[GET_NODE_SUMMARY_URL];
          const dimensions = this.getDimensions(dimensionsX, companies);

          if (dimensions.length === 0) {
            return null;
          }

          const chartTitle = (
            <ProfileTitle
              template={title}
              summary={data[GET_NODE_SUMMARY_URL]}
              year={year}
              commodityName={commodityName}
            />
          );

          const scatterplots = this.getScatterplots(dimensions, chartTitle);
          return (
            <section className="c-scatterplot-container" data-test={testId}>
              <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
              <div className="row">
                <div className="small-12 columns">
                  <div>
                    {printMode && <h3 className="title">{chartTitle}</h3>}
                    {scatterplots.map((plot, index) => (
                      <Scatterplot
                        key={index}
                        title={plot.title}
                        data={companies}
                        yDimension={dimensionY}
                        xDimension={dimensions}
                        xDimensionSelectedIndex={index}
                        testId={`${testId}-scatterplot`}
                        node={{ id: nodeId, name: summary.nodeName }}
                        year={year}
                        showTooltipCallback={this.onMouseMove(data[GET_ACTOR_EXPORTING_COMPANIES])}
                        hideTooltipCallback={this.onMouseLeave}
                      />
                    ))}
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

ImportingCompaniesWidget.propTypes = {
  testId: PropTypes.string,
  printMode: PropTypes.bool,
  year: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  commodityName: PropTypes.string
};

export default ImportingCompaniesWidget;
