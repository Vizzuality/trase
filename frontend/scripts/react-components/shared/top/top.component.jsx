/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Placehold from 'react-placehodl';
import 'react-components/shared/top/top.scss';
import Heading from 'react-components/shared/heading/heading.component';

class Top extends Component {
  constructor(props) {
    super(props);

    this.seed = Math.random();
  }

  renderList() {
    const { data, targetLink, year, unit } = this.props;
    const getLink = item => ({
      type: targetLink.type,
      payload: { ...targetLink.payload, query: { nodeId: item.id, year } }
    });
    return data.map((item, index) => (
      <li key={index} className="top-item">
        <div className="item-name">
          <span className="node-name">{item.name}</span>
          {this.props.targetLink && !item.is_domestic_consumption && (
            <Link className="outside-link" to={getLink(item)}>
              <svg className="icon icon-outside-link">
                <use xlinkHref="#icon-outside-link" />
              </svg>
            </Link>
          )}
        </div>
        <span className="item-value notranslate" data-unit={unit.value}>
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
    const { title, loading } = this.props;
    return (
      <div className="c-top">
        {title && (
          <Heading as="h3" variant="mono" size="sm">
            {title}
          </Heading>
        )}
        {loading && this.renderPlaceholder()}
        {!loading && <ul className="top-list">{this.renderList()}</ul>}
      </div>
    );
  }
}

Top.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  year: PropTypes.number.isRequired,
  targetLink: PropTypes.object,
  unit: PropTypes.shape({
    name: PropTypes.string.isRequired,
    format: PropTypes.func.isRequired,
    value: PropTypes.string
  }).isRequired
};

export default Top;
