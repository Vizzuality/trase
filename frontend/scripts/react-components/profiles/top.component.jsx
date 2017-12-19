import React, { Component } from 'react';
import 'styles/components/profiles/top.scss';
import formatValue from 'utils/formatValue';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';


class Top extends Component {
  renderList() {
    return this.props.data.map((item, index) => {
      item.value = isArray(item.values)
        ? formatValue(item.values[0] * 100, 'percentage')
        : formatValue(item.value * 100, 'percentage');
      item.link = this.targetLink && !item.is_domestic_consumption
        ? `/profile-${this.targetLink}?nodeId=${item.id}&year=${this.year}`
        : null;

      return (
        <li key={index} className="top-item">
          <span className="item-name">
            <span className="node-name">{index + 1}. {item.name}</span>
            {item.link &&
            <a href={item.link} className="outside-link">
              <svg className="icon icon-outside-link">
                <use xlinkHref="#icon-outside-link" />
              </svg>
            </a>}
          </span>
          {(this.props.unit && index === 0) ?
            <span className="item-value" data-unit={this.props.unit}>{item.value}</span>
            :
            <span className="item-value">{item.value}</span>
          }
        </li>
      );
    });
  }

  render() {
    return (
      <div className="c-top">
        <h3 className="title -small">
          {this.props.title}
        </h3>
        <ul className="top-list">
          {this.renderList()}
        </ul>
      </div>
    );
  }
}

Top.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  unit: PropTypes.string
};

export default Top;
