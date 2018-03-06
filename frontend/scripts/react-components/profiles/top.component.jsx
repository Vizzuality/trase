/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Placehold from 'react-placehodl';
import cx from 'classnames';
import formatValue from 'utils/formatValue';
import 'styles/components/shared/top.scss';

class Top extends Component {
  static getValue(value, format) {
    const formatFn = !format ? x => formatValue(x * 100, 'percentage') : formatValue;
    return Array.isArray(value) ? formatFn(value[0], format) : formatFn(value, format);
  }
  constructor(props) {
    super(props);
    this.state = {
      toggled: false
    };
    this.seed = Math.random();
    this.toggleValues = this.toggleValues.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderPlaceholder = this.renderPlaceholder.bind(this);
  }

  toggleValues() {
    this.setState(state => ({ toggled: !state.toggled }));
  }

  renderList() {
    const { data, targetLink, year, valueProp, toggle } = this.props;
    return data.map((item, index) => {
      const val = this.state.toggled ? item[toggle.valueProp] : item[valueProp];
      const format = this.state.toggled ? toggle.format : null;
      const unit = this.state.toggled ? toggle.unit : this.props.unit;
      const itemValue = Top.getValue(val, format);
      return (
        <li key={index} className="top-item">
          <div className="item-name">
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
          </div>
          {unit ? (
            <span
              className={cx('item-value', { '-toggable': !!toggle })}
              data-unit={unit}
              onClick={this.toggleValues}
            >
              {itemValue}
            </span>
          ) : (
            <span className="item-value">{itemValue}</span>
          )}
        </li>
      );
    });
  }

  renderPlaceholder() {
    return (
      <Placehold seed={this.seed} prefix="top-placeholder">
        {({ getParagraph, getLine }) => (
          <React.Fragment>
            <div className="top-placeholder-paragraph">
              {Array(10)
                .fill(0)
                .map((line, i) => (
                  <div key={`line-wrapper-${i}`} className="top-placeholder-line-wrapper">
                    {getLine(3, 5)}
                    <svg className="icon icon-outside-link">
                      <use xlinkHref="#icon-outside-link" />
                    </svg>
                  </div>
                ))}
            </div>
            {getParagraph(10, 1, 3)}
          </React.Fragment>
        )}
      </Placehold>
    );
  }

  render() {
    const { title } = this.props;
    return (
      <div className="c-top">
        <h3 className={cx('subtitle -dark', { 'is-hidden': !title })}>{title}</h3>
        {this.props.data.length > 0 ? (
          <ul className="top-list">{this.renderList()}</ul>
        ) : (
          this.renderPlaceholder()
        )}
      </div>
    );
  }
}

Top.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  year: PropTypes.number.isRequired,
  targetLink: PropTypes.string,
  unit: PropTypes.string,
  valueProp: PropTypes.string,
  toggle: PropTypes.shape({
    valueProp: PropTypes.string,
    unit: PropTypes.string,
    unitFormat: PropTypes.string
  })
};

export default Top;
