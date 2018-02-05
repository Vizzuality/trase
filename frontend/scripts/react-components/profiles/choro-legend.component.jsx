import 'styles/components/tool/map/map-legend.scss';
import { PROFILE_CHOROPLETH_CLASSES } from 'constants';
import abbreviateNumber from 'utils/abbreviateNumber';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class ChoroLegend extends Component {
  abbreviateNumber(x, index) {
    return index === 0 ? `<${abbreviateNumber(x, 0)}` : `>${abbreviateNumber(x, 0)}`;
  }

  render() {
    const { title, bucket } = this.props;

    return (
      <div className="bucket-container js-bucket-legend -horizontal -profile">
        <div className="bucket-names">
          <div className="layer-name">{title[0]}</div>
          <div className="layer-name">{title[1]}</div>
        </div>
        <ul className="bucket-legend" data-colors="5">
          {PROFILE_CHOROPLETH_CLASSES.map((color, index) => (
            <li className="bucket-item" key={index}>
              <div className={classnames('bucket', color)}>
                {typeof bucket !== 'undefined' &&
                  bucket !== null && <span>{this.abbreviateNumber(bucket[0][index], index)}</span>}
              </div>
            </li>
          ))}
        </ul>

        <svg className="icon icon-bidimensional-legend-arrows">
          <use xlinkHref="#icon-bidimensional-legend-arrows" />
        </svg>
        <svg className="icon icon-unidimensional-legend-arrows">
          <use xlinkHref="#icon-unidimensional-legend-arrows" />
        </svg>

        <ul className="bullets">
          <li>
            <div className="bullet ch-default" style={{ background: '#ebebeb' }} />
            N/A
          </li>
          <li>
            <div className="bullet ch-zero" style={{ background: '#fffff' }} />
            0
          </li>
        </ul>
      </div>
    );
  }
}

ChoroLegend.propTypes = {
  title: PropTypes.array,
  bucket: PropTypes.array
};

export default ChoroLegend;
