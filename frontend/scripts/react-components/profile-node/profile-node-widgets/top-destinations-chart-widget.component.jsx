import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import Line from 'react-components/profiles/line.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import Tooltip from 'components/shared/info-tooltip.component';
import formatValue from 'utils/formatValue';
import DropdownTabSwitcher from 'react-components/profiles/dropdown-tab-switcher.component';

const TranslatedLine = withTranslation(Line);

class TopDestinationsChartWidget extends React.PureComponent {
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
      if (this.tooltip) {
        this.tooltip.show(
          x,
          y,
          `${this.props.nodeName} > ${location.name.toUpperCase()}, ${location.date.getFullYear()}`,
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

  getTitle() {
    const { type, year, nodeName, verb } = this.props;
    const noun = type === 'countries' ? 'destination countries' : 'sourcing regions';
    return (
      <React.Fragment>
        Top {noun} of soy {verb} by <span className="notranslate">{capitalize(nodeName)}</span> in{' '}
        <span className="notranslate">{year}</span>
      </React.Fragment>
    );
  }

  getTooltipRef = ref => {
    this.tooltip = new Tooltip(ref);
  };

  render() {
    const {
      lines,
      year,
      profileType,
      unit,
      type,
      style,
      includedYears,
      tabs,
      onChangeTab,
      height
    } = this.props;
    return (
      <React.Fragment>
        <div className="c-info-tooltip is-hidden" ref={this.getTooltipRef} />
        <div className="top-destinations-chart-container">
          <div>
            {type === 'countries' ? (
              <h3 className="title -small">{this.getTitle()}</h3>
            ) : (
              <DropdownTabSwitcher
                title={this.getTitle()}
                items={tabs}
                onSelectedIndexChange={onChangeTab}
              />
            )}
          </div>
          <div style={{ height, width: '100%' }}>
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
      </React.Fragment>
    );
  }
}

TopDestinationsChartWidget.propTypes = {
  tabs: PropTypes.array,
  onChangeTab: PropTypes.func,
  profileType: PropTypes.string,
  verb: PropTypes.string.isRequired,
  lines: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  nodeName: PropTypes.string.isRequired,
  includedYears: PropTypes.array.isRequired
};

export default TopDestinationsChartWidget;
