import React from 'react';
import PropTypes from 'prop-types';
import UnitsTooltip from 'react-components/shared/units-tooltip.component';
import formatValue from 'utils/formatValue';
import { translateText } from 'utils/transifex';
import ChoroLegend from 'react-components/profiles/choro-legend.component';
import cx from 'classnames';
import Map from 'react-components/profiles/map.component';

class TopDestinationsMap extends React.PureComponent {
  state = { tooltipConfig: null };

  onMouseMove = (geography, x, y) => {
    const { lines, nodeName, activeTab } = this.props;
    const searchKey = activeTab ? 'geoid' : 'iso2';
    const polygon = lines.find(c => geography.properties[searchKey] === c.geo_id);
    if (polygon) {
      const text = `${polygon.name.toUpperCase()} > ${nodeName}`;
      const title = 'Trade Volume';
      const unit = 't';
      const value = formatValue(polygon.values[0], 'Trade volume');
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
    return `-outline ch-${value}`;
  };

  getTopoJsonRoot() {
    const { activeTab } = this.props;
    if (activeTab) {
      return `BRAZIL_${activeTab.toUpperCase()}`;
    }
    return 'world';
  }

  getTopoJsonLink() {
    const { activeTab } = this.props;
    if (activeTab) {
      return `./vector_layers/BRAZIL_${activeTab.toUpperCase()}.topo.json`;
    }
    return './vector_layers/WORLD.topo.json';
  }

  render() {
    const { year, printMode, buckets, verb, activeTab, height } = this.props;
    const { tooltipConfig } = this.state;
    const width = activeTab ? 400 : '100%';
    return (
      <React.Fragment>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <div className="row align-right">
          <div
            className={cx('column', 'small-12', {
              'medium-6': printMode,
              'medium-8': !printMode
            })}
          >
            <ChoroLegend
              title={[translateText(`Soy ${verb} in ${year}`), translateText('(tonnes)')]}
              bucket={[buckets[0], ...buckets]}
            />
          </div>
          <div className="column small-12 medium-10">
            <div className="top-destinations-map-container" style={{ height, width }}>
              <Map
                topoJSONPath={this.getTopoJsonLink()}
                topoJSONRoot={this.getTopoJsonRoot()}
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
  printMode: PropTypes.bool,
  activeTab: PropTypes.string,
  profileType: PropTypes.string,
  verb: PropTypes.string.isRequired,
  lines: PropTypes.array.isRequired,
  year: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  buckets: PropTypes.array.isRequired,
  nodeName: PropTypes.string.isRequired
};

export default TopDestinationsMap;
