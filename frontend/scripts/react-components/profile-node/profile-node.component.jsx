import React from 'react';
import PropTypes from 'prop-types';
import SummaryWidget from 'react-components/profile-node/profile-node-widgets/summary-widget.component';
import LinksWidget from 'react-components/profile-node/profile-node-widgets/links-widget.component';
import SustainabilityTableWidget from 'react-components/profile-node/profile-node-widgets/sustainability-table-widget.component';
import DeforestationWidget from 'react-components/profile-node/profile-node-widgets/deforestation-widget.component';
import TopConsumersWidget from 'react-components/profile-node/profile-node-widgets/top-consumers-widget.component';
import ImportingCompaniesWidget from 'react-components/profile-node/profile-node-widgets/importing-companies-widget.component';
import TopDestinationsWidget from 'react-components/profile-node/profile-node-widgets/top-destinations-widget.component';
import ProfileSelector from 'react-components/shared/profile-selector';
import GfwWidget from 'react-components/profile-node/profile-node-widgets/gfw-widget.component';
import ErrorCatch from 'react-components/shared/error-catch.component';
import Text from 'react-components/shared/text';
import cx from 'classnames';
import sortBy from 'lodash/sortBy';

import 'styles/components/shared/dropdown.scss';
import 'styles/components/profiles/area-select.scss';
import 'styles/components/profiles/map.scss';
import 'styles/components/profiles/overall-info.scss';
import 'styles/components/profiles/info.scss';

class ProfileNode extends React.PureComponent {
  static propTypes = {
    printMode: PropTypes.bool,
    context: PropTypes.object,
    errorMetadata: PropTypes.any,
    profileMetadata: PropTypes.object,
    year: PropTypes.number.isRequired,
    nodeId: PropTypes.number.isRequired,
    profileType: PropTypes.string.isRequired,
    loadingMetadata: PropTypes.bool.isRequired,
    updateQueryParams: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired
  };

  // if requestIdleCallback is not supported (Edge, IE) we render the iframe immediately
  state = {
    renderIframes: typeof window.requestIdleCallback === 'undefined'
  };

  componentDidMount() {
    if (window.requestIdleCallback) {
      // http://www.aaronpeters.nl/blog/iframe-loading-techniques-performance
      window.addEventListener('load', this.renderIframes, false);
      if (document.readyState === 'complete') {
        window.requestIdleCallback(this.renderIframes);
      }
    }
  }

  componentWillUnmount() {
    if (window.requestIdleCallback) {
      window.removeEventListener('load', this.renderIframes);
    }
  }

  getAnchorRef = ref => {
    this.anchor = ref;
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

  renderSection = chart => {
    const {
      year,
      nodeId,
      context,
      printMode,
      profileType,
      profileMetadata,
      updateQueryParams,
      openModal
    } = this.props;
    switch (chart.chart_type) {
      case 'line_chart_with_map': {
        const isCountries = chart.identifier === 'actor_top_countries';
        return (
          <TopDestinationsWidget
            key={chart.id}
            className={cx('page-break-inside-avoid', {
              'c-top-map ': isCountries,
              'c-top-municipalities': !isCountries
            })}
            year={year}
            nodeId={nodeId}
            title={chart.title}
            type={chart.identifier}
            contextId={context.id}
            onLinkClick={updateQueryParams}
            countryName={context.countryName}
            commodityName={context.commodityName}
            testId={isCountries ? 'top-destination-countries' : 'top-sourcing-regions'}
          />
        );
      }
      case 'tabs_table': {
        const isActor = profileType === 'actor';
        return (
          <SustainabilityTableWidget
            key={chart.id}
            type={isActor ? 'risk' : 'indicators'}
            profileType={profileType}
            className={cx('c-profiles-table', {
              'page-break-inside-avoid': isActor,
              'score-table': !isActor
            })}
            year={year}
            nodeId={nodeId}
            title={chart.title}
            contextId={context.id}
            commodityName={context.commodityName}
            testId={isActor ? 'deforestation-risk' : 'sustainability-indicators'}
            targetPayload={{ profileType: isActor ? 'place' : 'actor' }}
          />
        );
      }
      case 'scatterplot':
        return (
          <ImportingCompaniesWidget
            key={chart.id}
            year={year}
            nodeId={nodeId}
            title={chart.title}
            printMode={printMode}
            contextId={context.id}
            commodityName={context.commodityName}
            testId="company-compare"
          />
        );
      case 'stacked_line_chart':
        return (
          <DeforestationWidget
            key={chart.id}
            year={year}
            nodeId={nodeId}
            title={chart.title}
            contextId={context.id}
            commodityName={context.commodityName}
            testId="deforestation-trajectory"
          />
        );
      case 'sankey': {
        const type = chart.identifier === 'place_top_consumer_actors' ? 'actor' : 'place';
        return (
          <TopConsumersWidget
            key={chart.id}
            year={year}
            type={type}
            nodeId={nodeId}
            title={chart.title}
            contextId={context.id}
            onLinkClick={updateQueryParams}
            commodityName={context.commodityName}
            testId={type === 'actor' ? 'top-traders' : 'top-importers'}
          />
        );
      }
      default:
        return (
          <React.Fragment key={chart.id}>
            <SummaryWidget
              key={chart.id}
              year={year}
              nodeId={nodeId}
              context={context}
              title={chart.title}
              printMode={printMode}
              profileType={profileType}
              profileMetadata={profileMetadata}
              onYearChange={this.onYearChange}
              openModal={openModal}
            />
            <div className="profile-content-anchor" ref={this.getAnchorRef} />
            <ProfileSelector />
          </React.Fragment>
        );
    }
  };

  render() {
    const {
      year,
      nodeId,
      context,
      printMode,
      profileType,
      profileMetadata,
      loadingMetadata,
      errorMetadata
    } = this.props;
    const { renderIframes } = this.state;
    const ready = !loadingMetadata && !errorMetadata;

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
        {ready &&
          sortBy(profileMetadata.charts, 'position').map(chart => (
            <ErrorCatch
              key={`${year}_${context.id}_${profileType}_${chart.identifier}_${chart.id}`}
              renderFallback={() => (
                <section className="section-placeholder">
                  <Text variant="mono" size="md" weight="bold">
                    Error!
                  </Text>
                </section>
              )}
            >
              {this.renderSection(chart)}
            </ErrorCatch>
          ))}
        {ready &&
          profileType === 'place' &&
          GFW_WIDGETS_BASE_URL &&
          context.countryName === 'BRAZIL' && (
            <GfwWidget
              year={year}
              nodeId={nodeId}
              contextId={context.id}
              renderIframes={renderIframes}
              profileType={profileType}
            />
          )}
        {ready && (
          <LinksWidget
            year={year}
            nodeId={nodeId}
            contextId={context.id}
            profileType={profileType}
          />
        )}
      </div>
    );
  }
}

export default ProfileNode;
