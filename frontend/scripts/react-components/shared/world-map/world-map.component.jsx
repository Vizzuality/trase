import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ComposableMap,
  Geographies,
  Geography,
  Lines,
  ZoomableGroup,
  Annotations,
  Annotation,
  Line
} from 'react-simple-maps';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import cx from 'classnames';
import formatValue from 'utils/formatValue';
import xor from 'lodash/xor';

import 'scripts/react-components/shared/world-map/world-map.scss';

class WorldMap extends Component {
  static buildCurves(start, end, arc) {
    const x0 = start[0];
    const x1 = end[0];
    const y0 = start[1];
    const y1 = end[1];
    const curve = {
      forceUp: `${x1} ${y0}`,
      forceDown: `${x0} ${y1}`
    }[arc.curveStyle];

    return `M ${start.join(' ')} Q ${curve} ${end.join(' ')}`;
  }

  static isDestinationCountry(iso, countries) {
    return countries.map(f => f.geoId).includes(iso);
  }

  constructor(props) {
    super(props);
    this.state = {
      tooltipConfig: null
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.renderGeographies = this.renderGeographies.bind(this);
    this.renderLines = this.renderLines.bind(this);
    this.renderCountriesAnnotations = this.renderCountriesAnnotations.bind(this);
  }

  componentDidMount() {
    if (this.props.flows.length === 0 && this.props.selectedContext && this.props.selectedYears) {
      this.props.getTopNodes();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.selectedContext) {
      return;
    }

    if (
      !this.props.selectedContext ||
      nextProps.selectedContext.id !== this.props.selectedContext.id ||
      xor(nextProps.selectedYears, this.props.selectedYears).length !== 0
    ) {
      this.props.getTopNodes();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.flows.length !== 0 || !nextProps.selectedContext;
  }

  onMouseMove(geometry, e) {
    const { flows } = this.props;
    const geoId = geometry.properties ? geometry.properties.iso2 : geometry.geoId;
    if (WorldMap.isDestinationCountry(geoId, flows)) {
      const x = e.clientX + 10;
      const y = e.clientY + window.scrollY + 10;
      const text = geometry.name || geometry.properties.name;
      const title = 'Trade Volume';
      const unit = 't';
      const volume = geometry.value || (flows.find(flow => flow.geoId === geoId) || {}).value;
      const value = formatValue(volume, 'tons');
      const tooltipConfig = { x, y, text, items: [{ title, value, unit }] };
      this.setState(() => ({ tooltipConfig }));
    }
  }

  onMouseLeave() {
    this.setState(() => ({ tooltipConfig: null }));
  }

  renderGeographies(geographies, projection) {
    const { originGeoId, flows, originCountries } = this.props;
    const countries = flows.length > 0 ? flows : originCountries;
    return geographies.map(
      geography =>
        geography.properties.iso2 !== 'AQ' && (
          <Geography
            key={geography.properties.cartodb_id}
            className={cx(
              'world-map-geography',
              { '-dark': WorldMap.isDestinationCountry(geography.properties.iso2, countries) },
              { '-pink': originGeoId === geography.properties.iso2 }
            )}
            geography={geography}
            projection={projection}
            onMouseMove={this.onMouseMove}
            onMouseLeave={this.onMouseLeave}
          />
        )
    );
  }

  renderLines() {
    const { flows, originCoordinates } = this.props;

    return flows.map(flow => (
      <Line
        key={flow.geoId}
        className="world-map-arc"
        line={{
          ...flow,
          coordinates: {
            start: flow.coordinates,
            end: originCoordinates
          }
        }}
        buildPath={WorldMap.buildCurves}
        strokeWidth={flow.strokeWidth}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
      />
    ));
  }

  renderCountriesAnnotations() {
    const { originCountries } = this.props;
    return originCountries.map(country => {
      const { annotationPos = [] } = country;
      if (annotationPos.length === 0) {
        console.warn(`Country ${country.name} missing annotation position coordinates`);
        return null;
      }
      return (
        <Annotation
          key={country.geoId}
          dx={annotationPos[0] || 5}
          dy={annotationPos[1] || 5}
          subject={country.coordinates}
          strokeWidth={1}
        >
          <text className="world-map-annotation-text -label">{country.name}</text>
        </Annotation>
      );
    });
  }

  render() {
    const { renderFlows } = this.props;
    const { tooltipConfig } = this.state;
    return (
      <React.Fragment>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <ComposableMap
          className="c-world-map"
          projection="robinson"
          style={{ width: '100%', height: 'auto' }}
          projectionConfig={{
            scale: 145
          }}
        >
          <ZoomableGroup disablePanning center={[20, 0]}>
            <Geographies geography="/vector_layers/WORLD.topo.json" disableOptimization>
              {this.renderGeographies}
            </Geographies>
            <Lines>{renderFlows && this.renderLines()}</Lines>
            <Annotations>{!renderFlows && this.renderCountriesAnnotations()}</Annotations>
          </ZoomableGroup>
        </ComposableMap>
      </React.Fragment>
    );
  }
}

WorldMap.propTypes = {
  renderFlows: PropTypes.bool.isRequired,
  flows: PropTypes.array.isRequired,
  originAnnotationPos: PropTypes.array,
  originCoordinates: PropTypes.array,
  originGeoId: PropTypes.string,
  selectedContext: PropTypes.object,
  selectedYears: PropTypes.array,
  originCountries: PropTypes.array,
  getTopNodes: PropTypes.func.isRequired
};

export default WorldMap;
