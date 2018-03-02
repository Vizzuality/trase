import React from 'react';
import PropTypes from 'prop-types';
import {
  ComposableMap,
  Geographies,
  Geography,
  Markers,
  ZoomableGroup,
  Annotations,
  Annotation
} from 'react-simple-maps';
import cx from 'classnames';
import Arc from 'react-components/shared/world-map/map-arc.component';

class WorldMap extends React.PureComponent {
  static buildCurves(start, end, arc) {
    const x0 = start[0];
    const x1 = end[0];
    const y0 = start[1];
    const y1 = end[1];
    const curve = {
      concave: `${x1} ${y0}`,
      convex: `${x0} ${y1}`
    }[arc.curveStyle];

    return `M ${start.join(' ')} Q ${curve} ${end.join(' ')}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      active: null
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.renderGeographies = this.renderGeographies.bind(this);
    this.renderArcs = this.renderArcs.bind(this);
    this.renderFlowsAnnotations = this.renderFlowsAnnotations.bind(this);
    this.renderCountriesAnnotations = this.renderCountriesAnnotations.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedContext !== this.props.selectedContext ||
      prevProps.selectedYears !== this.props.selectedYears
    ) {
      this.props.getTopNodes();
    }
  }

  onMouseEnter(e) {
    const active = e.properties ? e.properties.iso2 : e.geoId;
    setTimeout(() => this.setState(() => ({ active })));
  }

  onMouseLeave() {
    this.setState(() => ({ active: null }));
  }

  renderGeographies(geographies, projection) {
    const { flows, origin, contextCountries } = this.props;

    const isDark = iso =>
      (flows.length > 0 ? flows : contextCountries).map(f => f.geoId).includes(iso);
    return geographies.map(geography => (
      <Geography
        key={geography.properties.cartodb_id}
        className={cx(
          'world-map-geography',
          { '-dark': isDark(geography.properties.iso2) },
          { '-pink': origin && origin.geoId === geography.properties.iso2 }
        )}
        geography={geography}
        projection={projection}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    ));
  }

  renderArcs() {
    const { flows, origin } = this.props;

    return flows.map(flow => (
      <Arc
        key={flow.geoId}
        className="world-map-arc"
        arc={{
          ...flow,
          coordinates: {
            start: flow.coordinates,
            end: origin.coordinates
          }
        }}
        buildPath={WorldMap.buildCurves}
        strokeWidth={flow.strokeWidth}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    ));
  }

  renderFlowsAnnotations() {
    const { flows } = this.props;

    return flows.map((flow, i) => (
      <Annotation
        key={flow.geoId}
        dx={flow.curveStyle === 'convex' ? 5 : -5}
        dy={-5}
        subject={flow.coordinates}
        strokeWidth={0}
      >
        <text
          className={cx('world-map-annotation-text', {
            'is-hidden': this.state.active !== flow.geoId
          })}
        >{`${i + 1}.${flow.name}`}</text>
      </Annotation>
    ));
  }

  renderCountriesAnnotations() {
    const { contextCountries } = this.props;
    return contextCountries.map(country => {
      const { annotationPos = [] } = country;
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
    const { flows } = this.props;
    return (
      <ComposableMap className="c-world-map">
        <ZoomableGroup>
          <Geographies geography="/vector_layers/WORLD.topo.json" disableOptimization>
            {this.renderGeographies}
          </Geographies>
          <Markers>{this.renderArcs()}</Markers>
          <Annotations>
            {flows.length > 0 ? this.renderFlowsAnnotations() : this.renderCountriesAnnotations()}
          </Annotations>
        </ZoomableGroup>
      </ComposableMap>
    );
  }
}

WorldMap.propTypes = {
  flows: PropTypes.array.isRequired,
  origin: PropTypes.object,
  selectedContext: PropTypes.object,
  selectedYears: PropTypes.array,
  contextCountries: PropTypes.array,
  getTopNodes: PropTypes.func.isRequired
};

export default WorldMap;
