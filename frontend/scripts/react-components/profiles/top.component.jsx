import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Placehold from 'react-placehodl';
import formatValue from 'utils/formatValue';
import 'styles/components/shared/top.scss';

class Top extends Component {
  constructor(props) {
    super(props);
    this.seed = Math.random();
    this.renderList = this.renderList.bind(this);
    this.renderPlaceholder = this.renderPlaceholder.bind(this);
  }

  renderList() {
    const { data, targetLink, year, valueProp } = this.props;
    return (
      data.map((item, index) => {
        const itemValue = Array.isArray(item[valueProp])
          ? formatValue(item[valueProp][0] * 100, 'percentage')
          : formatValue(item[valueProp] * 100, 'percentage');

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
      })
    );
  }

  renderPlaceholder() {
    return (
      <Placehold seed={this.seed} prefix="top-placeholder">
        {({ getParagraph, getLine }) =>
          <React.Fragment>
            <div className="top-placeholder-paragraph">
            {
              Array(10).fill(0)
                .map((line, i) => (
                  <div key={`line-wrapper-${i}`} className="top-placeholder-line-wrapper">
                    {getLine(3, 5)}
                    <svg className="icon icon-outside-link">
                      <use xlinkHref="#icon-outside-link" />
                    </svg>
                  </div>
                ))
            }
            </div>
            {getParagraph(10, 1, 3)}
          </React.Fragment>
        }
      </Placehold>
    )
  }

  render() {
    return (
      <div className="c-top">
        <h3 className="title -small">{this.props.title}</h3>
        {this.props.data.length > 0
          ? <ul className="top-list">{this.renderList()}</ul>
          : this.renderPlaceholder()
        }
      </div>
    );
  }
}

Top.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  targetLink: PropTypes.string,
  unit: PropTypes.string,
  valueProp: PropTypes.string
};

export default Top;
