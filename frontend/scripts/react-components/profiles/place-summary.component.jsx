/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profiles/title-group';
import Map from 'react-components/profiles/map.component';
import formatValue from 'utils/formatValue';

class PlaceSummary extends React.PureComponent {
  render() {
    const {
      year,
      tooltips,
      onYearChange,
      context,
      data: {
        columnName,
        countryName,
        jurisdiction2,
        jurisdiction2GeoId,
        jurisdiction1,
        jurisdiction1GeoId,
        summary,
        area,
        soyProduction,
        soyArea,
        jurisdictionName,
        jurisdictionGeoId
      } = {},
      profileMetadata: {
        adm1Name,
        adm1TopojsonPath,
        adm1TopojsonRoot,
        adm2Name,
        adm2TopojsonPath,
        adm2TopojsonRoot,
        mainTopojsonPath,
        mainTopojsonRoot
      } = {}
    } = this.props;
    const { commodityName } = context;
    const titles = [
      { name: jurisdictionName, label: capitalize(columnName) },
      { name: commodityName, label: 'Commodity' },
      {
        dropdown: true,
        label: 'Year',
        value: { label: `${year}`, value: year },
        options: (context.years
          ? context.years.map(_year => ({ label: `${_year}`, value: _year }))
          : []
        ).sort((a, b) => b.value - a.value),
        onYearChange
      }
    ];
    const soyValue = formatValue(soyArea, 'area');
    const areaValue = formatValue(area, 'area');
    const soyProductionValue = formatValue(soyProduction, 'tons');

    return (
      <React.Fragment>
        <div className="c-overall-map hide-for-small" data-test="place-summary">
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
              {adm1TopojsonPath && adm1TopojsonRoot && (
                <div className="row">
                  <div className="small-3 columns">
                    <div className="c-locator-map">
                      {countryName && (
                        <Map
                          topoJSONPath={`./vector_layers${adm1TopojsonPath.replace(
                            '$stateGeoId$',
                            jurisdiction1GeoId
                          )}`}
                          topoJSONRoot={adm1TopojsonRoot}
                          getPolygonClassName={d =>
                            d.properties.geoid === jurisdiction2GeoId ? '-isCurrent' : ''
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="small-9 columns">
                    <div className="c-info">
                      <div className="legend">{adm1Name}</div>
                      <div className="name -medium">
                        {jurisdiction2 ? capitalize(jurisdiction2) : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="small-4 columns map-item">
              {adm2TopojsonPath && adm2TopojsonRoot && (
                <div className="row">
                  <div className="small-3 columns">
                    <div className="c-locator-map">
                      {countryName && (
                        <Map
                          topoJSONPath={`./vector_layers${adm2TopojsonPath.replace(
                            '$stateGeoId$',
                            jurisdiction1GeoId
                          )}`}
                          topoJSONRoot={adm2TopojsonRoot}
                          getPolygonClassName={d =>
                            d.properties.geoid === jurisdiction1GeoId ? '-isCurrent' : ''
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="small-9 columns">
                    <div className="c-info">
                      <div className="legend">{adm2Name}</div>
                      <div className="name -medium">
                        {jurisdiction1 ? capitalize(jurisdiction1) : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="c-overall-info page-break-inside-avoid">
          <div className="row">
            {mainTopojsonPath && mainTopojsonRoot && (
              <div className="small-12 medium-4 large-3 columns">
                <div className="c-locator-map map-municipality-banner">
                  {countryName && (
                    <Map
                      topoJSONPath={`./vector_layers${mainTopojsonPath.replace(
                        '$stateGeoId$',
                        jurisdiction1GeoId
                      )}`}
                      topoJSONRoot={mainTopojsonRoot.replace('$stateGeoId$', jurisdiction1GeoId)}
                      getPolygonClassName={d =>
                        d.properties.geoid === jurisdictionGeoId ? '-isCurrent' : ''
                      }
                    />
                  )}
                </div>
              </div>
            )}
            <div className="small-12 medium-8 large-9 columns">
              <div className="row">
                <div className="small-12 columns">
                  <TitleGroup titles={titles} on={onYearChange} />
                </div>
                {(areaValue !== '-' || soyValue !== '-' || soyProductionValue !== '-') && (
                  <div className="small-12 columns">
                    {areaValue !== '-' && (
                      <div className="stat-item">
                        <div className="legend">area</div>
                        <div className="value">{areaValue}</div>
                        <div className="unit">
                          km<sup>2</sup>
                        </div>
                      </div>
                    )}
                    {soyValue !== '-' && (
                      <div className="stat-item">
                        <div className="legend">
                          {commodityName} land
                          <HelpTooltip
                            text={get(tooltips, 'profileNode.soyLand')}
                            position="bottom"
                          />
                        </div>
                        <div className="value">{soyValue}</div>
                        <div className="unit">ha</div>
                      </div>
                    )}
                    {soyProductionValue !== '-' && (
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
                    )}
                  </div>
                )}
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
  context: PropTypes.object,
  tooltips: PropTypes.object,
  onYearChange: PropTypes.func.isRequired,
  profileMetadata: PropTypes.object.isRequired
};

export default PlaceSummary;
