import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import capitalize from 'lodash/capitalize';
import Line from 'react-components/profiles/line.component';
import Tooltip from 'components/shared/info-tooltip.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import formatValue from 'utils/formatValue';

const TranslatedLine = withTranslation(Line);

class ActorLineChart extends Component {
  lineChartSettings = {
    margin: {
      top: 10,
      right: 100,
      bottom: 30,
      left: 50
    },
    height: 244,
    ticks: {
      yTicks: 6,
      yTickPadding: 10,
      yTickFormatType: 'top-location',
      xTickPadding: 15
    },
    lineClassNameCallback: (lineIndex, lineDefaultStyle) => `${lineDefaultStyle} line-${lineIndex}`,
    hideTooltipCallback: () => this.tooltip && this.tooltip.hide(),
    showTooltipCallback: (location, x, y) => {
      const {
        data: { nodeName }
      } = this.props;
      if (this.tooltip) {
        this.tooltip.show(
          x,
          y,
          `${nodeName} > ${location.name.toUpperCase()}, ${location.date.getFullYear()}`,
          [
            {
              title: 'Trade volume',
              value: formatValue(location.value, 'Trade volume'),
              unit: 't'
            }
          ]
        );
      }
    }
  };

  getTooltipRef = ref => {
    this.tooltip = new Tooltip(ref);
  };

  render() {
    const {
      printMode,
      year,
      data: { nodeName, columnName, lines, includedYears, style, unit, profileType }
    } = this.props;
    const verb = columnName === 'EXPORTER' ? 'exported' : 'imported';
    return (
      <React.Fragment>
        <div className="c-info-tooltip is-hidden" ref={this.getTooltipRef} />
        <div className="row">
          <div
            className={cx('small-12', 'columns', {
              'medium-6': printMode,
              'medium-8': printMode
            })}
          >
            <div className="row column">
              <h3 className="title -small">
                Top destination countries of Soy {verb} by{' '}
                <span className="notranslate">{capitalize(nodeName)}</span>
              </h3>
            </div>
            <div className="c-line">
              <TranslatedLine
                profileType={profileType}
                unit={unit}
                lines={lines.slice(0, 5)}
                style={style}
                xValues={includedYears}
                settings={this.lineChartSettings}
                useBottomLegend
                year={year}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ActorLineChart.propTypes = {
  printMode: PropTypes.bool,
  data: PropTypes.any,
  year: PropTypes.number
};

export default ActorLineChart;
