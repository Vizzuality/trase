import React, { Component } from 'react';
// import { geoLength } from "d3-geo"

class Arc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      pressed: false
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  handleMouseEnter(evt) {
    evt.persist();
    const { onMouseEnter, marker } = this.props;
    this.setState(
      {
        hover: true
      },
      () => onMouseEnter && onMouseEnter(marker, evt)
    );
  }
  handleMouseMove(evt) {
    evt.persist();
    if (this.state.pressed) return;
    const { onMouseMove, marker } = this.props;
    if (!this.state.hover) {
      this.setState(
        {
          hover: true
        },
        () => onMouseMove && onMouseMove(marker, evt)
      );
    } else if (onMouseMove) onMouseMove(marker, evt);
    else return;
  }
  handleMouseLeave(evt) {
    evt.persist();
    const { onMouseLeave, marker } = this.props;
    this.setState(
      {
        hover: false
      },
      () => onMouseLeave && onMouseLeave(marker, evt)
    );
  }
  handleMouseDown(evt) {
    evt.persist();
    const { onMouseDown, marker } = this.props;
    this.setState(
      {
        pressed: true
      },
      () => onMouseDown && onMouseDown(marker, evt)
    );
  }
  handleMouseUp(evt) {
    evt.persist();
    const { onMouseUp, marker } = this.props;
    this.setState(
      {
        pressed: false
      },
      () => onMouseUp && onMouseUp(marker, evt)
    );
  }
  handleMouseClick(evt) {
    if (!this.props.onClick) return;
    evt.persist();
    const { onClick, marker, projection } = this.props;
    return onClick && onClick(marker, projection(marker.coordinates), evt);
  }
  handleFocus(evt) {
    evt.persist();
    const { onFocus, marker } = this.props;
    this.setState(
      {
        hover: true
      },
      () => onFocus && onFocus(marker, evt)
    );
  }
  handleBlur(evt) {
    evt.persist();
    const { onBlur, marker } = this.props;
    this.setState(
      {
        hover: false
      },
      () => onBlur && onBlur(marker, evt)
    );
  }
  render() {
    const {
      projection,
      marker,
      style,
      tabable,
      zoom,
      children,
      preserveMarkerAspect,
      width,
      height
    } = this.props;

    const { pressed, hover } = this.state;

    // const scale = preserveMarkerAspect ? ` scale(${1/zoom})` : "";
    // const translation = projection(marker.coordinates);

    // const lineString = {
    //   "type": "Feature",
    //   "geometry": {
    //     "type": "LineString",
    //     "coordinates": [
    //       projection.invert([width/2,height/2]),
    //       marker.coordinates,
    //     ],
    //   },
    // };
    //
    // const isHidden = geoLength(lineString) > 1.5708

    const start = projection(marker.coordinatesStart);
    const end = projection(marker.coordinatesEnd);

    const x0 = start[0];
    const x1 = end[0];
    const y0 = start[1];
    const y1 = end[1];
    const path = `M${x0},${y0}L${x1}, ${y1}`;

    return <path d={path} />;
  }
}

Arc.defaultProps = {
  style: {
    default: {},
    hover: {},
    pressed: {}
  },
  marker: {
    coordinatesStart: [0, 0],
    coordinatesEnd: [-99.14337158203125, 19.435514339097825]
  },
  tabable: true,
  preserveMarkerAspect: true
};

export default Arc;
