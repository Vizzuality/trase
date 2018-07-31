import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { GET_ACTOR_EXPORTING_COMPANIES, GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import Scatterplot from 'react-components/profiles/scatterplot.component';

class ImportingCompaniesWidget extends React.PureComponent {
  getScatterplots(dimensionsX, title) {
    const { printMode } = this.props;
    if (printMode) {
      return dimensionsX.map(xDimension => ({
        title: <span data-unit={xDimension.unit}>{xDimension.name}</span>
      }));
    }

    return [{ title }];
  }

  render() {
    const { year, nodeId, contextId, printMode } = this.props;
    const params = { node_id: nodeId, context_id: contextId };
    return (
      <Widget
        query={[GET_ACTOR_EXPORTING_COMPANIES, GET_NODE_SUMMARY_URL]}
        params={[{ ...params, year }, { ...params, profile_type: 'actor' }]}
      >
        {({ data, loading, error }) => {
          if (loading || error) return null;
          const { dimensionsX, companies } = data[GET_ACTOR_EXPORTING_COMPANIES];
          const { nodeName, columnName } = data[GET_NODE_SUMMARY_URL];
          const verb = columnName === 'EXPORTER' ? 'exporting' : 'importing';
          const dimensions = dimensionsX.slice(0, 3);
          const title = `Comparing companies ${verb} Soy from Brazil in ${year}`;
          const scatterplots = this.getScatterplots(dimensions, title);
          return (
            <section className="c-scatterplot-container">
              <div className="row">
                <div className="small-12 columns">
                  <div>
                    {printMode && <h3 className="title">{title}</h3>}
                    {scatterplots.map((plot, index) => (
                      <Scatterplot
                        key={index}
                        title={plot.title}
                        data={companies}
                        xDimension={dimensions}
                        xDimensionSelectedIndex={index}
                        node={{ id: nodeId, name: nodeName }}
                        year={year}
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
  printMode: PropTypes.bool,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default ImportingCompaniesWidget;
