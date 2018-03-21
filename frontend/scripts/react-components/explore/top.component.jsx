/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Placehold from 'react-placehodl';
import cx from 'classnames';
import 'styles/components/shared/top.scss';

class Top extends Component {
  constructor(props) {
    super(props);

    this.seed = Math.random();
  }

  renderList() {
    const { data, targetLink, year, unit } = this.props;

    return data.map((item, index) => (
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
        <span className="item-value" data-unit={unit.name}>
          {unit.format(item)}
        </span>
      </li>
    ));
  }

  renderPlaceholder() {
    return (
      <Placehold seed={this.seed} prefix="top-placeholder">
        {({ getParagraph }) => (
          <React.Fragment>
            {getParagraph(10, 3, 5)}
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
  unit: PropTypes.shape({
    name: PropTypes.string.isRequired,
    format: PropTypes.func.isRequired
  }).isRequired
};

export default Top;
