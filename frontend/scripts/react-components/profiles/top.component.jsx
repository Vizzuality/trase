import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import formatValue from 'utils/formatValue';
import 'styles/components/shared/top.scss';

class Top extends Component {
  renderList() {
    const { data, targetLink, year } = this.props;
    return data.map((item, index) => {
      const itemValue = Array.isArray(item.values)
        ? formatValue(item.values[0] * 100, 'percentage')
        : formatValue(item.value * 100, 'percentage');

      return (
        <li key={index} className="top-item">
          <span className="item-name">
            <span className="node-name">{item.name}</span>
            {this.props.targetLink &&
              !item.is_domestic_consumption && (
                <Link
                  className="outside-link"
                  to={{ type: targetLink, payload: { query: { nodeId: item.id, year } } }}
                >
                  <svg className="icon icon-outside-link">
                    <use xlinkHref="#icon-outside-link" />
                  </svg>
                </Link>
              )}
          </span>
          {this.props.unit ? (
            <span className="item-value" data-unit={this.props.unit}>
              {itemValue}
            </span>
          ) : (
            <span className="item-value">{itemValue}</span>
          )}
        </li>
      );
    });
  }

  render() {
    return (
      <div className="c-top">
        <h3 className="title -small">{this.props.title}</h3>
        <ul className="top-list">{this.renderList()}</ul>
      </div>
    );
  }
}

Top.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  targetLink: PropTypes.string,
  unit: PropTypes.string
};

export default Top;
