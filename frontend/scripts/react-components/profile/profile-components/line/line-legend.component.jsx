/* eslint-disable react/no-danger */

import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';

import './line.scss';

class LineLegend extends React.PureComponent {
  render() {
    const filteredSortedLines = [...this.props.lines]
      .sort((a, b) => {
        const last = this.props.xValues.length - 1;
        if (a.values[last] > b.values[last]) return 1;
        if (a.values[last] < b.values[last]) return -1;
        return 0;
      })
      .filter(lineData => lineData.values.filter(v => v !== null).length);

    return filteredSortedLines.map((lineData, index) => {
      const style =
        typeof this.props.style !== 'undefined' ? this.props.style.style : lineData.style;

      if (typeof lineData.legend_name !== 'undefined') {
        return (
          <div key={index}>
            <svg className="icon line-style-icon">
              <use xlinkHref={`#icon-${style}`} />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: lineData.legend_name }} />
            {lineData.legend_tooltip && <Tooltip text={lineData.legend_tooltip} />}
          </div>
        );
      }
      return null;
    });
  }
}

LineLegend.propTypes = {
  lines: PropTypes.array,
  style: PropTypes.object,
  xValues: PropTypes.array
};

export default LineLegend;
