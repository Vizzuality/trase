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
  GET_COUNTRY_TOP_CONSUMER_COUNTRIES
} from 'utils/getURLFromParams';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

class MapFlowsWidget extends React.PureComponent {
  showLink(item) {
    return item.profile ? 'profile' : null;
  }

  render() {
    const { nodeId, profileType, title, year, commodityName, commodityId, contextId } = this.props;
    const contextProp = contextId ? { context_id: contextId } : { commodity_id: commodityId };
    const params = { node_id: nodeId, year, ...contextProp };

    return (
      <Widget
        query={[GET_COUNTRY_NODE_SUMMARY_URL, GET_COUNTRY_TOP_CONSUMER_COUNTRIES]}
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

          const selectedContext = {
            worldMap: {
              geoId: data[GET_COUNTRY_NODE_SUMMARY_URL].geoId
            }
          };

          const destinationCountries = nodes
            .sort((nodeA, nodeB) => nodeB.height - nodeA.height)
            .map(node => {
              const percent = 100 * node.height;
              return {
                ...node,
                pct: `${percent * 10 >= 1 ? formatValue(percent, 'percentage') : '< 0.1'}%`,
                coordinates: COUNTRIES_COORDINATES[node.geo_id]
              };
            });

          const highlightedCountriesIso = {
            level2: destinationCountries.map(n => n.geo_id)
          };

          const dataList = destinationCountries.map(n => ({
            label: n.name,
            value: n.pct
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
                    context={selectedContext}
                    highlightedCountriesIso={highlightedCountriesIso}
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
  profileType: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  commodityName: PropTypes.string
};

export default MapFlowsWidget;
