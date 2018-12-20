import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import camelCase from 'lodash/camelCase';

function GfwWidget(props) {
  const { year, nodeId, contextId, profileType, renderIframes } = props;
  const params = { node_id: nodeId, context_id: contextId, profile_type: profileType, year };
  const GADM_DICTIONARY_URL = '/BRAZIL_GADM_GEOID.json';
  return (
    <Widget
      params={[params]}
      query={[GET_NODE_SUMMARY_URL, GADM_DICTIONARY_URL]}
      raw={[false, true]}
    >
      {({ data, error, loading }) => {
        if (error) {
          // TODO: display a proper error message to the user
          console.error('Error loading summary data for profile page', error);
          return null;
        }

        if (loading || !renderIframes) {
          return null;
        }

        // TODO: update this when merging with configurable profile pages
        const { municipalityGeoId } = data[GET_NODE_SUMMARY_URL];
        const gadm = data[GADM_DICTIONARY_URL];
        const { path, match } = gadm[camelCase(municipalityGeoId)];

        if (match < 0.9) {
          return null;
        }

        return (
          <React.Fragment>
            <section className="mini-sankey-container">
              <div className="row align-center">
                <div className="column small-10">
                  <iframe
                    title="tree cover loss"
                    width="100%"
                    height="510"
                    frameBorder="0"
                    src={`//0.0.0.0:5000/embed/dashboards/country/${path}?widget=treeLoss&trase=true`}
                  />
                </div>
              </div>
            </section>
            <section className="mini-sankey-container">
              <div className="row align-center">
                <div className="column small-10">
                  <iframe
                    title="gfw integration"
                    width="100%"
                    height="510"
                    frameBorder="0"
                    src={`//0.0.0.0:5000/embed/dashboards/country/${path}?widget=gladAlerts&trase=true`}
                  />
                </div>
              </div>
            </section>
          </React.Fragment>
        );
      }}
    </Widget>
  );
}

GfwWidget.propTypes = {
  year: PropTypes.number,
  nodeId: PropTypes.number,
  contextId: PropTypes.number,
  renderIframes: PropTypes.bool,
  profileType: PropTypes.string
};

export default GfwWidget;
