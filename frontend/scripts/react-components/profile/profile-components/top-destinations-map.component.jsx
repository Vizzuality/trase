import React from 'react';
import PropTypes from 'prop-types';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import formatValue from 'utils/formatValue';
import ChoroLegend from 'react-components/profile/profile-components/choro-legend/choro-legend.component';
import cx from 'classnames';
import Map from 'react-components/profile/profile-components/map.component';
import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';

class TopDestinationsMap extends React.PureComponent {
  state = { tooltipConfig: null };

  onMouseMove = (geography, x, y) => {
    const { year, includedYears, lines, summary, activeTab } = this.props;
    const searchKey = activeTab ? 'geoid' : 'iso2';
    const polygon = lines.find(c => geography.properties[searchKey] === c.geo_id);
    if (polygon) {
      const text = `${polygon.name.toUpperCase()} > ${summary?.nodeName}`;
      const title = 'Trade Volume';
      const unit = 't';
      const yearIndex = includedYears.findIndex(ye => ye === year);
      const currentYear = polygon.values[yearIndex];
      const value = currentYear ? formatValue(currentYear, 'Trade volume') : 'Unknown';
      const tooltipConfig = { x, y, text, items: [{ title, value, unit }] };
      this.setState(() => ({ tooltipConfig }));
    }
  };

  onMouseLeave = () => {
    this.setState(() => ({ tooltipConfig: null }));
  };

  getPolygonClassName = geography => {
    const { lines, activeTab } = this.props;
    const searchKey = activeTab ? 'geoid' : 'iso2';
    const polygon = lines.find(c => geography.properties[searchKey] === c.geo_id);
    let value = 'n-a';
    if (polygon) value = typeof polygon.value9 !== 'undefined' ? polygon.value9 : 'n-a';
    return `ch-${value}`;
  };

  getPolygonTestId = (geography, testId) => {
    const { lines, activeTab } = this.props;
    const searchKey = activeTab ? 'geoid' : 'iso2';
    const polygon = lines.find(c => geography.properties[searchKey] === c.geo_id);
    if (polygon) {
      return `${testId}-polygon-colored`;
    }
    return `${testId}-polygon`;
  };

  getTopoJsonRoot() {
    const { activeTab, countryName } = this.props;
    if (activeTab) {
      return countryName && `${countryName.toUpperCase()}_${activeTab.toUpperCase()}`;
    }
    return 'world';
  }

  getTopoJsonLink() {
    const { activeTab, countryName } = this.props;
    if (activeTab) {
      return (
        countryName &&
        `./vector_layers/${countryName.toUpperCase()}_${activeTab.toUpperCase()}.topo.json`
      );
    }
    return './vector_layers/WORLD.topo.json';
  }

  render() {
    const {
      year,
      printMode,
      buckets,
      title,
      summary,
      activeTab,
      height,
      commodityName,
      testId
    } = this.props;
    const { tooltipConfig } = this.state;
    const width = activeTab ? 400 : '100%';

    return (
      <React.Fragment>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <div className="row align-right" data-test={testId}>
          <div
            className={cx('column', 'small-12', {
              'medium-6': printMode
            })}
          >
            <ChoroLegend
              testId={`${testId}-legend`}
              title={
                <ProfileTitle
                  template={title}
                  summary={summary}
                  year={year}
                  commodityName={commodityName}
                />
              }
              bucket={[buckets[0], ...buckets]}
            />
          </div>
          <div className="column small-12">
            <div className="top-destinations-map-container" style={{ height, width }}>
              <Map
                testId={`${testId}-d3`}
                topoJSONPath={this.getTopoJsonLink()}
                topoJSONRoot={this.getTopoJsonRoot()}
                getPolygonTestId={this.getPolygonTestId}
                getPolygonClassName={this.getPolygonClassName}
                showTooltipCallback={this.onMouseMove}
                hideTooltipCallback={this.onMouseLeave}
                useRobinsonProjection={!activeTab}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

TopDestinationsMap.propTypes = {
  testId: PropTypes.string,
  printMode: PropTypes.bool,
  nodeName: PropTypes.string,
  activeTab: PropTypes.string,
  profileType: PropTypes.string,
  lines: PropTypes.array.isRequired,
  year: PropTypes.number.isRequired,
  title: PropTypes.object,
  height: PropTypes.number.isRequired,
  buckets: PropTypes.array.isRequired,
  summary: PropTypes.object.isRequired,
  countryName: PropTypes.string.isRequired,
  includedYears: PropTypes.array.isRequired,
  commodityName: PropTypes.string.isRequired
};

export default TopDestinationsMap;
