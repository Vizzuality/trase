/* eslint-disable */
import React, { Component } from 'react';
import { geoLength } from 'd3-geo';

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
    const { onMouseEnter, arc } = this.props;
    this.setState(
      {
        hover: true
      },
      () => onMouseEnter && onMouseEnter(arc, evt)
    );
  }
  handleMouseMove(evt) {
    evt.persist();
    if (this.state.pressed) return;
    const { onMouseMove, arc } = this.props;
    if (!this.state.hover) {
      this.setState(
        {
          hover: true
        },
        () => onMouseMove && onMouseMove(arc, evt)
      );
    } else if (onMouseMove) onMouseMove(arc, evt);
    else return;
  }
  handleMouseLeave(evt) {
    evt.persist();
    const { onMouseLeave, arc } = this.props;
    this.setState(
      {
        hover: false
      },
      () => onMouseLeave && onMouseLeave(arc, evt)
    );
  }
  handleMouseDown(evt) {
    evt.persist();
    const { onMouseDown, arc } = this.props;
    this.setState(
      {
        pressed: true
      },
      () => onMouseDown && onMouseDown(arc, evt)
    );
  }
  handleMouseUp(evt) {
    evt.persist();
    const { onMouseUp, arc } = this.props;
    this.setState(
      {
        pressed: false
      },
      () => onMouseUp && onMouseUp(arc, evt)
    );
  }
  handleMouseClick(evt) {
    if (!this.props.onClick) return;
    evt.persist();
    const { onClick, arc, projection } = this.props;
    return (
      onClick &&
      onClick(arc, [projection(arc.coordinates.start), projection(arc.coordinates.end)], evt)
    );
  }
  handleFocus(evt) {
    evt.persist();
    const { onFocus, arc } = this.props;
    this.setState(
      {
        hover: true
      },
      () => onFocus && onFocus(arc, evt)
    );
  }
  handleBlur(evt) {
    evt.persist();
    const { onBlur, arc } = this.props;
    this.setState(
      {
        hover: false
      },
      () => onBlur && onBlur(arc, evt)
    );
  }
  render() {
    const {
      projection,
      arc,
      style,
      tabable,
      zoom,
      preserveMarkerAspect,
      width,
      height,
      buildPath,
      strokeWidth
    } = this.props;

    const { pressed, hover } = this.state;

    const scale = preserveMarkerAspect ? ` scale(${1 / zoom})` : '';

    const buildLineString = coordinates => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [projection.invert([width / 2, height / 2]), coordinates]
      }
    });
    const startLineString = buildLineString(arc.coordinates.start);
    const endLineString = buildLineString(arc.coordinates.end);
    const isHidden = geoLength(startLineString) > 1.5708 || geoLength(endLineString) > 1.5708;

    const start = projection(arc.coordinates.start);
    const end = projection(arc.coordinates.end);

    const path = buildPath ? buildPath(start, end, arc) : `M ${start.join(' ')} L ${end.join(' ')}`;

    return (
      <path
        className={`rsm-arc${pressed ? ' rsm-arc--pressed' : ''}${hover ? ' rsm-arc--hover' : ''}`}
        transform={`${scale}`}
        style={
          style[
            isHidden ? 'hidden' : pressed || hover ? (pressed ? 'pressed' : 'hover') : 'default'
          ]
        }
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onClick={this.handleMouseClick}
        onMouseMove={this.handleMouseMove}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        tabIndex={tabable ? 0 : -1}
        d={path}
        strokeWidth={strokeWidth}
      />
    );
  }
}

Arc.defaultProps = {
  style: {
    default: {},
    hover: {},
    pressed: {}
  },
  arc: {
    coordinates: {
      start: [0, 0],
      end: [-99.1, 19.4]
    }
  },
  tabable: true,
  preserveMarkerAspect: true,
  strokeWidth: 1
};

export default Arc;
