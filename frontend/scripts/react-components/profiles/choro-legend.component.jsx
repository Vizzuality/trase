import { PROFILE_CHOROPLETH_CLASSES } from 'constants';
import abbreviateNumber from 'utils/abbreviateNumber';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'styles/components/tool/map/map-legend.scss';

class ChoroLegend extends Component {
  abbreviateNumber(x, index) {
    return index === 0 ? `<${abbreviateNumber(x, 0)}` : `>${abbreviateNumber(x, 0)}`;
  }

  render() {
    const { title, unit, bucket, testId } = this.props;

    return (
      <div className="c-map-legend-choro" data-test={testId}>
        <div className="bucket-container -horizontal -profile">
          <div className="bucket-names">
            <div className="layer-name">{title}</div>
            <div className="layer-name">{unit}</div>
          </div>
          <ul className="bucket-legend">
            {PROFILE_CHOROPLETH_CLASSES.map((color, index) => (
              <li className="bucket-item" key={index}>
                <div className={cx('bucket', color)}>
                  {typeof bucket !== 'undefined' && bucket !== null && (
                    <span>{this.abbreviateNumber(bucket[index], index)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <ul className="bullets">
            <li>
              <div className="bullet ch-default" />
              N/A
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

ChoroLegend.propTypes = {
  testId: PropTypes.string,
  title: PropTypes.string,
  unit: PropTypes.string,
  bucket: PropTypes.array
};

export default ChoroLegend;
