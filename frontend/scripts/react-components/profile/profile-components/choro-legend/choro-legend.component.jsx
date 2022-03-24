import { PROFILE_CHOROPLETH_CLASSES } from 'constants';
import abbreviateNumber from 'utils/abbreviateNumber';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import 'react-components/profile/profile-components/choro-legend/choro-legend.scss';

class ChoroLegend extends Component {
  abbreviateNumber(x, index) {
    return index === 0 ? `<${abbreviateNumber(x, 0)}` : `>${abbreviateNumber(x, 0)}`;
  }

  render() {
    const { title, bucket, testId } = this.props;
    return (
      <div className="c-choro-legend" data-test={testId}>
        <div className="bucket-container -horizontal -profile">
          <div className="bucket-names">
            <div className="layer-name">{title}</div>
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
              <div className="bullet ch-na" />
              No data
            </li>
            <li>
              <div className="bullet ch-zero" />0
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

ChoroLegend.propTypes = {
  testId: PropTypes.string,
  title: PropTypes.object,
  bucket: PropTypes.array
};

export default ChoroLegend;
