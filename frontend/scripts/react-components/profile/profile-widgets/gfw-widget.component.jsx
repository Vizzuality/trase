import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { getSummaryEndpoint } from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import ReactIframeResizer from 'react-iframe-resizer-super';
import ISO2_TO_ISO3 from './data/ISO2_TO_ISO3.json';
import BRAZIL_GADM_GEOID from './data/BRAZIL_GADM_GEOID.json';

class GfwWidget extends React.PureComponent {
  renderSpinner() {
    return (
      <div className="section-placeholder">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  render() {
    const { year, nodeId, contextId, profileType, renderIframes } = this.props;
    const params = { node_id: nodeId, context_id: contextId, profile_type: profileType, year };
    const renderIframe = path => (
      <React.Fragment>
        <section className="gfw-widget-container">
          <div className="row align-center">
            <div className="column small-10">
              <ReactIframeResizer
                title={() => 'Glad alerts'}
                src={`//${GFW_WIDGETS_BASE_URL}/embed/widget/gladAlertsSimple/country/${path}?widget=gladAlertsSimple&trase=true`}
                style={{
                  width: '100%',
                  minHeight: 520
                }}
                iframeResizerOptions={{
                  checkOrigin: false,
                  log: false
                }}
              />
            </div>
          </div>
        </section>
      </React.Fragment>
    );

    return (
      <Widget params={[params]} query={[getSummaryEndpoint(profileType)]} raw={[false]}>
        {({ data, error, loading }) => {
          if (error) {
            // TODO: display a proper error message to the user
            console.error('Error loading summary data for profile page', error);
            return null;
          }

          if (profileType === 'country' && !loading) {
            const { geoId } = data[getSummaryEndpoint(profileType)];
            if (geoId) {
              return renderIframe(ISO2_TO_ISO3[geoId]);
            }
            console.error(
              'GFW widget: Country iso 2 is missing or iso 3 is missing from ISO2_TO_ISO3.json'
            );
            return null;
          }

          if (loading || !renderIframes) {
            return this.renderSpinner();
          }
          const { jurisdictionGeoId } = data[getSummaryEndpoint(profileType)];
          const { path, match } = BRAZIL_GADM_GEOID.data[jurisdictionGeoId];

          return match < 0.9 ? null : renderIframe(path);
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
