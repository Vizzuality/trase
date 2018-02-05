/* eslint-disable react/no-danger */
import 'styles/components/profiles/line.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LineLegend extends Component {
  render() {
    const filteredSortedLines = this.props.data.lines
      .sort((a, b) => {
        const last = this.props.xValues.length - 1;
        if (a.values[last] > b.values[last]) return 1;
        if (a.values[last] < b.values[last]) return -1;
        return 0;
      })
      .filter(lineData => lineData.values.filter(v => v !== null).length);

    return filteredSortedLines.map((lineData, index) => {
      const style =
        typeof this.props.data.style !== 'undefined' ? this.props.data.style.style : lineData.style;

      if (typeof lineData.legend_name !== 'undefined') {
        return (
          <div key={index}>
            <svg className="icon">
              <use xlinkHref={`#icon-${style}`} />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: lineData.legend_name }} />
          </div>
        );
      }
      return null;
    });
  }
}

LineLegend.propTypes = {
  data: PropTypes.object,
  xValues: PropTypes.array
};

export default LineLegend;
