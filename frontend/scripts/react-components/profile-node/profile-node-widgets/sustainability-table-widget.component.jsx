import React from 'react';
import PropTypes from 'prop-types';
import MultiTable from 'react-components/profiles/multi-table/multi-table.component';
import Widget from 'react-components/widgets/widget.component';
import {
  GET_PLACE_INDICATORS,
  GET_ACTOR_SUSTAINABILITY,
  GET_NODE_SUMMARY_URL
} from 'utils/getURLFromParams';
import flatMap from 'lodash/flatMap';
import addApostrophe from 'utils/addApostrophe';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

class SustainabilityTableWidget extends React.PureComponent {
  getTitle(nodeName) {
    const { year, type } = this.props;
    if (type === 'indicators') {
      return 'Sustainability indicators:';
    }

    return (
      <span>
        Deforestation risk associated with <span className="notranslate">{nodeName}</span>
        {addApostrophe(nodeName)} top sourcing regions in{' '}
        <span className="notranslate">{year}</span>:
      </span>
    );
  }

  render() {
    const {
      year,
      nodeId,
      contextId,
      type,
      className,
      profileType,
      testId,
      targetPayload
    } = this.props;
    const params = { node_id: nodeId, context_id: contextId, year };
    const mainQuery = type === 'indicators' ? GET_PLACE_INDICATORS : GET_ACTOR_SUSTAINABILITY;
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[params, { ...params, profile_type: profileType }]}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div className="spinner-section" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            // TODO: display a proper error message to the user
            console.error('Error loading sustainability table data for profile page', error);
            return (
              <div className="spinner-section" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            return null;
          }

          const rows = flatMap(data[mainQuery], e => e.rows);

          if (rows.length === 0) {
            return null;
          }

          const values = flatMap(data[mainQuery], e => e.values);

          if (values.length === 0) {
            return null;
          }

          const { nodeName } = data[GET_NODE_SUMMARY_URL];
          return (
            <section className={className} data-test={testId}>
              <div className="row">
                <div className="small-12 columns">
                  <MultiTable
                    year={year}
                    contextId={contextId}
                    type={type === 'indicators' ? 't_head_places' : 't_head_actors'}
                    data={data[mainQuery]}
                    tabsTitle={this.getTitle(nodeName)}
                    target={item => (item.name === 'Municipalities' ? 'profileNode' : null)}
                    targetPayload={targetPayload}
                    testId={`${testId}-multi`}
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

SustainabilityTableWidget.propTypes = {
  testId: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired,
  targetPayload: PropTypes.object.isRequired
};

export default SustainabilityTableWidget;
