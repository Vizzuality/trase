import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import MiniSankey from 'react-components/profiles/mini-sankey/mini-sankey.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import {
  GET_NODE_SUMMARY_URL,
  GET_PLACE_TOP_CONSUMER_ACTORS,
  GET_PLACE_TOP_CONSUMER_COUNTRIES
} from 'utils/getURLFromParams';
import capitalize from 'lodash/capitalize';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';
import Heading from 'react-components/shared/heading/heading.component';

const TranslatedMiniSankey = withTranslation(MiniSankey);

class TopConsumersWidget extends React.PureComponent {
  getTitle(name) {
    const { type, year, commodityName } = this.props;
    const noun = type === 'actor' ? 'traders' : 'importer countries';
    if (type === 'actor') {
      return (
        <React.Fragment>
          Top {noun} of {commodityName} in <span className="notranslate">{capitalize(name)}</span>{' '}
          in <span className="notranslate">{year}</span>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        Top {noun} of <span className="notranslate">{capitalize(name)}</span> {commodityName} in{' '}
        <span className="notranslate">{year}</span>
      </React.Fragment>
    );
  }

  handleLinkClick = (linkTarget, { profileType, query }) => {
    this.props.onLinkClick(profileType, query);
  };

  render() {
    const { year, nodeId, contextId, type, onLinkClick, testId } = this.props;
    const params = { node_id: nodeId, context_id: contextId, year };
    const mainQuery =
      type === 'actor' ? GET_PLACE_TOP_CONSUMER_ACTORS : GET_PLACE_TOP_CONSUMER_COUNTRIES;
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[{ ...params, year }, { ...params, profile_type: 'place' }]}
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
            console.error('Error loading top consumer data for profile page', error);
            return (
              <div className="spinner-section" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            return null;
          }

          if (
            data[mainQuery] &&
            data[mainQuery].targetNodes &&
            data[mainQuery].targetNodes.length === 0
          ) {
            return null;
          }

          const { municipalityName } = data[GET_NODE_SUMMARY_URL];
          return (
            <section className="mini-sankey-container page-break-inside-avoid" data-test={testId}>
              <div className="row">
                <div className="small-12 columns">
                  <Heading as="h3" size="sm" data-test={`${testId}-title`}>
                    {this.getTitle(municipalityName)}
                  </Heading>
                  <TranslatedMiniSankey
                    year={year}
                    data={data[mainQuery]}
                    contextId={contextId}
                    testId={`${testId}-mini-sankey`}
                    onLinkClick={this.handleLinkClick}
                    targetLink={onLinkClick && 'profileNode'}
                    targetPayload={onLinkClick && { profileType: type }}
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

TopConsumersWidget.propTypes = {
  testId: PropTypes.string,
  onLinkClick: PropTypes.func,
  commodityName: PropTypes.string,
  year: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default TopConsumersWidget;
