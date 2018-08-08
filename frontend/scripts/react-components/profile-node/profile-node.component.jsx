import React from 'react';
import PropTypes from 'prop-types';
import SummaryWidget from 'react-components/profile-node/profile-node-widgets/summary-widget.component';
import SustainabilityTableWidget from 'react-components/profile-node/profile-node-widgets/sustainability-table-widget.component';
import DeforestationWidget from 'react-components/profile-node/profile-node-widgets/deforestation-widget.component';
import TopConsumersWidget from 'react-components/profile-node/profile-node-widgets/top-consumers-widget.component';
import ImportingCompaniesWidget from 'react-components/profile-node/profile-node-widgets/importing-companies-widget.component';
import TopDestinationsWidget from 'react-components/profile-node/profile-node-widgets/top-destinations-widget.component';
import { smoothScroll } from 'utils/smoothScroll';

class ProfileNode extends React.PureComponent {
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
            />
            <SustainabilityTableWidget
              type="risk"
              profileType={profileType}
              className="c-area-table page-break-inside-avoid"
              year={year}
              nodeId={nodeId}
              contextId={context.id}
            />
            <ImportingCompaniesWidget
              printMode={printMode}
              year={year}
              nodeId={nodeId}
              contextId={context.id}
              countryName={context.countryName}
              commodityName={context.commodityName}
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
            />
            <DeforestationWidget year={year} nodeId={nodeId} contextId={context.id} />
            <TopConsumersWidget
              year={year}
              type="actor"
              nodeId={nodeId}
              contextId={context.id}
              onLinkClick={updateQueryParams}
            />
            <TopConsumersWidget year={year} nodeId={nodeId} contextId={context.id} type="place" />
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
