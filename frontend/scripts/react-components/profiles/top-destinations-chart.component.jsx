import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import Line from 'react-components/profiles/line.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import formatValue from 'utils/formatValue';
import DropdownTabSwitcher from 'react-components/profiles/dropdown-tab-switcher.component';
import UnitsTooltip from 'react-components/shared/units-tooltip.component';

const TranslatedLine = withTranslation(Line);

class TopDestinationsChart extends React.PureComponent {
  state = { tooltipConfig: null };

  static getIsMobile() {
    return window.innerWidth <= 640; // value needs to match with entrypoints.scss variable
  }

  onMouseMove = (location, x, y) => {
    const text = `${
      this.props.nodeName
    } > ${location.name.toUpperCase()}, ${location.date.getFullYear()}`;
    const title = 'Trade Volume';
    const unit = 't';
    const value = formatValue(location.value, 'Trade volume');
    const tooltipConfig = { x, y, text, items: [{ title, value, unit }] };
    this.setState(() => ({ tooltipConfig }));
  };

  onMouseLeave = () => {
    this.setState(() => ({ tooltipConfig: null }));
  };

  margin = {
    top: 10,
    right: 100,
    bottom: 30,
    left: 50
  };

  height = 244;

  ticks = {
    yTicks: 6,
    yTickPadding: 10,
    yTickFormatType: 'top-location',
    xTickPadding: 15
  };

  lineClassNameCallback = (lineIndex, lineDefaultStyle) => `${lineDefaultStyle} line-${lineIndex}`;

  getTitle() {
    const { type, year, nodeName, verb, commodityName } = this.props;
    const noun = type === 'countries' ? 'destination countries' : 'sourcing regions';
    return (
      <React.Fragment>
        Top {noun} of {commodityName} {verb} by{' '}
        <span className="notranslate">{capitalize(nodeName)}</span> in{' '}
        <span className="notranslate">{year}</span>
      </React.Fragment>
    );
  }

  render() {
    const {
      year,
      profileType,
      unit,
      type,
      style,
      includedYears,
      tabs,
      onChangeTab,
      height,
      lines
    } = this.props;
    const { tooltipConfig } = this.state;
    const heightStyle = TopDestinationsChart.getIsMobile() ? { minHeigh: height } : { height };
    return (
      <React.Fragment>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
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
          <div
            className="top-destinations-chart-container"
            style={{ ...heightStyle, width: '100%' }}
          >
            <TranslatedLine
              profileType={profileType}
              unit={unit}
              lines={lines}
              style={style}
              xValues={includedYears}
              useBottomLegend
              year={year}
              showTooltipCallback={this.onMouseMove}
              hideTooltipCallback={this.onMouseLeave}
              lineClassNameCallback={this.lineClassNameCallback}
              margin={this.margin}
              settingsHeight={this.height}
              ticks={this.ticks}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

TopDestinationsChart.propTypes = {
  tabs: PropTypes.array,
  onChangeTab: PropTypes.func,
  profileType: PropTypes.string,
  commodityName: PropTypes.string,
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

export default TopDestinationsChart;
