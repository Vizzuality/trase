/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip.component';
import TitleGroup from 'react-components/profile-node/title-group.component';
import Map from 'react-components/profiles/map.component';
import formatValue from 'utils/formatValue';

class PlaceSummary extends React.PureComponent {
  render() {
    const {
      year,
      tooltips,
      onYearChange,
      data: {
        columnName,
        biomeName,
        biomeGeoId,
        stateName,
        stateGeoId,
        summary,
        area,
        soyProduction,
        soyArea,
        countryName,
        municipalityName,
        municipalityGeoId
      } = {}
    } = this.props;
    const titles = [
      { name: municipalityName, label: capitalize(columnName) },
      { name: 'Soy', label: 'Commodity' },
      {
        dropdown: true,
        label: 'Year',
        value: year,
        valueList: [2010, 2011, 2012, 2013, 2014, 2015],
        onValueSelected: onYearChange
      }
    ];
    const soyValue = soyArea !== null && soyArea !== 'NaN' ? formatValue(soyArea, 'area') : '-';
    const areaValue = area !== null ? formatValue(area, 'area') : '-';
    const soyProductionValue = soyProduction !== null ? formatValue(soyProduction, 'tons') : '-';

    return (
      <React.Fragment>
        <div className="c-overall-map hide-for-small">
          <div className="row">
            <div className="small-4 columns map-item">
              <div className="row">
                <div className="small-6 columns">
                  <div className="c-locator-map">
                    <Map
                      topoJSONPath="./vector_layers/WORLD.topo.json"
                      topoJSONRoot="world"
                      useRobinsonProjection
                      getPolygonClassName={d =>
                        d.properties.name.toUpperCase() === countryName ? '-isCurrent' : ''
                      }
                    />
                  </div>
                </div>
                <div className="small-6 columns">
                  <div className="c-info">
                    <div className="legend">country</div>
                    <div className="name -medium">
                      {countryName ? capitalize(countryName) : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="small-4 columns map-item">
              <div className="row">
                <div className="small-3 columns">
                  <div className="c-locator-map">
                    {countryName && (
                      <Map
                        topoJSONPath={`./vector_layers/${countryName.toUpperCase()}_BIOME.topo.json`}
                        topoJSONRoot={`${countryName.toUpperCase()}_BIOME`}
                        getPolygonClassName={d =>
                          d.properties.geoid === biomeGeoId ? '-isCurrent' : ''
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="small-9 columns">
                  <div className="c-info">
                    <div className="legend">biome</div>
                    <div className="name -medium js-biome-name">
                      {biomeName ? capitalize(biomeName) : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="small-4 columns map-item">
              <div className="row">
                <div className="small-3 columns">
                  <div className="c-locator-map">
                    {countryName && (
                      <Map
                        topoJSONPath={`./vector_layers/${countryName.toUpperCase()}_STATE.topo.json`}
                        topoJSONRoot={`${countryName.toUpperCase()}_STATE`}
                        getPolygonClassName={d =>
                          d.properties.geoid === stateGeoId ? '-isCurrent' : ''
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="small-9 columns">
                  <div className="c-info">
                    <div className="legend">state</div>
                    <div className="name -medium">{stateName ? capitalize(stateName) : '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="c-overall-info page-break-inside-avoid">
          <div className="row">
            <div className="small-12 medium-4 large-3 columns">
              <div className="c-locator-map">
                {countryName && (
                  <Map
                    topoJSONPath={`./vector_layers/municip_states/${countryName.toLowerCase()}/${stateGeoId}.topo.json`}
                    topoJSONRoot={`${countryName.toUpperCase()}_${stateGeoId}`}
                    getPolygonClassName={d =>
                      d.properties.geoid === municipalityGeoId ? '-isCurrent' : ''
                    }
                  />
                )}
              </div>
            </div>
            <div className="small-12 medium-8 large-9 columns">
              <div className="row">
                <div className="small-12 columns">
                  <TitleGroup titles={titles} on={onYearChange} />
                </div>
                <div className="small-12 columns">
                  <div className="stat-item">
                    <div className="legend">area</div>
                    <div className="value">{areaValue}</div>
                    <div className="unit">
                      km<sup>2</sup>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="legend">
                      soy land
                      <HelpTooltip text={get(tooltips, 'profileNode.soyLand')} position="bottom" />
                    </div>
                    <div className="value">{soyValue}</div>
                    <div className="unit">ha</div>
                  </div>
                  <div className="stat-item">
                    <div className="legend">
                      soy production
                      <HelpTooltip
                        text={get(tooltips, 'profileNode.soyProduction')}
                        position="bottom"
                      />
                    </div>
                    <div className="value">{soyProductionValue}</div>
                    <div className="unit">t</div>
                  </div>
                </div>
                <div className="small-12 columns">
                  <p className="summary" dangerouslySetInnerHTML={{ __html: summary }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

PlaceSummary.propTypes = {
  year: PropTypes.number,
  data: PropTypes.object,
  tooltips: PropTypes.object,
  onYearChange: PropTypes.func.isRequired
};

export default PlaceSummary;
