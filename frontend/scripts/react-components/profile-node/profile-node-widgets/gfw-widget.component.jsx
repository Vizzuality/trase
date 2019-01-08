import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import camelCase from 'lodash/camelCase';
import cx from 'classnames';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

class GfwWidget extends React.PureComponent {
  state = {
    gladAlertsLoaded: false
  };

  loadGladAlerts = () => this.setState({ gladAlertsLoaded: true });

  renderSpinner() {
    return (
      <div className="spinner-section">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  render() {
    const { year, nodeId, contextId, profileType, renderIframes } = this.props;
    const { gladAlertsLoaded } = this.state;
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
            return this.renderSpinner();
          }

          const { jurisdictionGeoId } = data[GET_NODE_SUMMARY_URL];
          const gadm = data[GADM_DICTIONARY_URL];
          const { path, match } = gadm[camelCase(jurisdictionGeoId)];

          if (match < 0.9) {
            return null;
          }

          return (
            <React.Fragment>
              {!gladAlertsLoaded && this.renderSpinner()}
              <section className={cx('gfw-widget-container', { 'is-hidden': !gladAlertsLoaded })}>
                <div className="row align-center">
                  <div className="column small-10">
                    <iframe
                      width="100%"
                      height="510"
                      frameBorder="0"
                      title="glad alerts"
                      onLoad={this.loadGladAlerts}
                      src={`//${GFW_WIDGETS_BASE_URL}/embed/dashboards/country/${path}?widget=gladAlerts&trase=true`}
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
}

GfwWidget.propTypes = {
  year: PropTypes.number,
  nodeId: PropTypes.number,
  contextId: PropTypes.number,
  renderIframes: PropTypes.bool,
  profileType: PropTypes.string
};

export default GfwWidget;
