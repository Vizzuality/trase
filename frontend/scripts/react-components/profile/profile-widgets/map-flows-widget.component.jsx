import React from 'react';
import PropTypes from 'prop-types';
import WorldMap from 'react-components/shared/world-map/world-map.container';

import DataList from 'react-components/shared/data-list/data-list.component';
import Widget from 'react-components/widgets/widget.component';
import Heading from 'react-components/shared/heading/heading.component';
import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';

import formatValue from 'utils/formatValue';

import { COUNTRIES_COORDINATES } from 'scripts/countries';

import {
  GET_COUNTRY_NODE_SUMMARY_URL,
  GET_COUNTRY_TOP_CONSUMER_COUNTRIES,
  GET_CONTEXTS_URL
} from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

class MapFlowsWidget extends React.PureComponent {
  showLink(item) {
    return item.profile ? 'profile' : null;
  }

  render() {
    const { nodeId, profileType, title, year, commodityName, contextId } = this.props;
    const params = { node_id: nodeId, year };
    return (
      <Widget
        query={[GET_COUNTRY_NODE_SUMMARY_URL, GET_COUNTRY_TOP_CONSUMER_COUNTRIES, GET_CONTEXTS_URL]}
        isRawDataUri
        params={[params, { ...params, profile_type: profileType }]}
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
            console.error('Error loading sustainability table data for profile page', error);
            return (
              <div className="section-placeholder" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            return null;
          }

          const nodes = data[GET_COUNTRY_TOP_CONSUMER_COUNTRIES].targetNodes; // eslint-disable-line
          const selectedContext = data[GET_CONTEXTS_URL].find(
            ctx => ctx.id === contextId
          );

          const destinationCountries = nodes.map(n => ({
            ...n,
            coordinates: COUNTRIES_COORDINATES[n.geo_id]
          }));

          const highlightedCountriesIso = {
            level2: destinationCountries.map(n => n.geo_id)
          };

          const dataList = destinationCountries.map(n => ({
            label: n.name,
            value: `${formatValue(n.value, 'percentage')}%`
          }));

          return (
            <section className="page-break-inside-avoid c-top-map">
              <div className="row align-justify">
                <div className="column small-12 medium-9">
                  <Heading variant="mono" weight="bold" size="md" as="h3">
                    <ProfileTitle
                      template={title}
                      summary={data[GET_COUNTRY_NODE_SUMMARY_URL]}
                      year={year}
                      commodityName={commodityName}
                    />
                  </Heading>
                  <WorldMap
                    id="explore"
                    selectedContext={selectedContext}
                    highlightedCountriesIso={highlightedCountriesIso}
                    context={selectedContext}
                    destinationCountries={destinationCountries}
                  />
                </div>
                <div className="column small-14 medium-3">
                  <DataList data={dataList} />
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

MapFlowsWidget.propTypes = {
  nodeId: PropTypes.number,
  contextId: PropTypes.number,
  profileType: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  commodityName: PropTypes.string,
};

export default MapFlowsWidget;
