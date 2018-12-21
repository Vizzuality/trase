import React from 'react';
import PropTypes from 'prop-types';
import SummaryWidget from 'react-components/profile-node/profile-node-widgets/summary-widget.component';
import SustainabilityTableWidget from 'react-components/profile-node/profile-node-widgets/sustainability-table-widget.component';
import DeforestationWidget from 'react-components/profile-node/profile-node-widgets/deforestation-widget.component';
import TopConsumersWidget from 'react-components/profile-node/profile-node-widgets/top-consumers-widget.component';
import ImportingCompaniesWidget from 'react-components/profile-node/profile-node-widgets/importing-companies-widget.component';
import TopDestinationsWidget from 'react-components/profile-node/profile-node-widgets/top-destinations-widget.component';
import GfwWidget from 'react-components/profile-node/profile-node-widgets/gfw-widget.component';
import { smoothScroll } from 'utils/smoothScroll';

// sketchy polyfill
const _requestIdleCallback = window.requestIdleCallback || window.setTimeout;

class ProfileNode extends React.PureComponent {
  state = {
    renderIframes: false
  };

  componentDidMount() {
    // http://www.aaronpeters.nl/blog/iframe-loading-techniques-performance
    window.addEventListener('load', this.renderIframes, false);
    if (document.readyState === 'complete') {
      _requestIdleCallback(this.renderIframes);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.renderIframes);
  }

  getAnchorRef = ref => {
    this.anchor = ref;
  };

  scrollTo = () => {
    if (this.anchor) {
      smoothScroll(this.anchor, 500);
    }
  };

  onYearChange = year => this.updateQuery('year', year);

  updateQuery(key, value) {
    const { nodeId, year, context, profileType, updateQueryParams } = this.props;
    updateQueryParams(profileType, {
      nodeId,
      year,
      contextId: context.id,
      [key]: value
    });
  }

  renderIframes = () => this.setState({ renderIframes: true });

  render() {
    const {
      printMode,
      year,
      nodeId,
      context,
      profileType,
      tooltips,
      updateQueryParams
    } = this.props;
    const { renderIframes } = this.state;
    return (
      <div className={`l-profile-${profileType}`}>
        {printMode && (
          <div className="top-logo">
            <div className="row">
              <div className="column small-12">
                <img src="/images/logos/new-logo-trase-red.svg" alt="TRASE" />
              </div>
            </div>
          </div>
        )}
        <SummaryWidget
          year={year}
          context={context}
          printMode={printMode}
          profileType={profileType}
          tooltips={tooltips}
          nodeId={nodeId}
          onYearChange={this.onYearChange}
          scrollTo={this.scrollTo}
        />
        <div className="profile-content-anchor" ref={this.getAnchorRef} />
        {profileType === 'actor' && (
          <React.Fragment>
            <TopDestinationsWidget
              className="c-top-map page-break-inside-avoid"
              year={year}
              nodeId={nodeId}
              type="countries"
              contextId={context.id}
              countryName={context.countryName}
              onLinkClick={updateQueryParams}
              commodityName={context.commodityName}
              testId="top-destination-countries"
            />
            <TopDestinationsWidget
              className="c-top-municipalities page-break-inside-avoid"
              year={year}
              type="regions"
              nodeId={nodeId}
              printMode={printMode}
              contextId={context.id}
              countryName={context.countryName}
              commodityName={context.commodityName}
              onLinkClick={updateQueryParams}
              profileType={profileType}
              testId="top-sourcing-regions"
            />
            <SustainabilityTableWidget
              type="risk"
              profileType={profileType}
              className="c-area-table page-break-inside-avoid"
              year={year}
              nodeId={nodeId}
              contextId={context.id}
              testId="deforestation-risk"
              targetPayload={{ profileType: 'place' }}
            />
            <ImportingCompaniesWidget
              printMode={printMode}
              year={year}
              nodeId={nodeId}
              contextId={context.id}
              countryName={context.countryName}
              commodityName={context.commodityName}
              testId="company-compare"
            />
          </React.Fragment>
        )}
        {profileType === 'place' && (
          <React.Fragment>
            <SustainabilityTableWidget
              profileType={profileType}
              type="indicators"
              className="c-area-table score-table"
              year={year}
              nodeId={nodeId}
              contextId={context.id}
              testId="sustainability-indicators"
              targetPayload={{ profileType: 'actor' }}
            />
            <DeforestationWidget
              year={year}
              nodeId={nodeId}
              contextId={context.id}
              testId="deforestation-trajectory"
            />
            <TopConsumersWidget
              year={year}
              type="actor"
              nodeId={nodeId}
              testId="top-traders"
              contextId={context.id}
              commodityName={context.commodityName}
              onLinkClick={updateQueryParams}
            />
            <TopConsumersWidget
              year={year}
              nodeId={nodeId}
              testId="top-importers"
              contextId={context.id}
              type="place"
              commodityName={context.commodityName}
            />
            <GfwWidget
              year={year}
              nodeId={nodeId}
              contextId={context.id}
              renderIframes={renderIframes}
              profileType={profileType}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

ProfileNode.propTypes = {
  printMode: PropTypes.bool,
  context: PropTypes.object,
  tooltips: PropTypes.object,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired,
  updateQueryParams: PropTypes.func.isRequired
};

export default ProfileNode;
