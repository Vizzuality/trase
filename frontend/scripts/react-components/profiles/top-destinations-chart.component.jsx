import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import Line from 'react-components/profiles/line/line.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import formatValue from 'utils/formatValue';
import DropdownTabSwitcher from 'react-components/profiles/dropdown-tab-switcher/dropdown-tab-switcher.component';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import Heading from 'react-components/shared/heading/heading.component';

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
        <span className="notranslate">{year}</span>:
      </React.Fragment>
    );
  }

  handleLinkClick = (linkTarget, query) => {
    this.props.onLinkClick(linkTarget, query);
  };

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
      lines,
      contextId,
      testId
    } = this.props;
    const { tooltipConfig } = this.state;
    const heightStyle = TopDestinationsChart.getIsMobile() ? { minHeigh: height } : { height };
    return (
      <React.Fragment>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <div className="top-destinations-chart-container">
          <div>
            {type === 'countries' ? (
              <Heading as="h3" size="sm" data-test={`${testId}-title`}>
                {this.getTitle()}
              </Heading>
            ) : (
              <DropdownTabSwitcher
                title={this.getTitle()}
                items={tabs}
                onSelectedIndexChange={onChangeTab}
                testId={`${testId}-switch`}
              />
            )}
          </div>
          <div
            className="top-destinations-chart-container"
            style={{ ...heightStyle, width: '100%' }}
          >
            <TranslatedLine
              onLinkClick={this.handleLinkClick}
              profileType={profileType}
              unit={unit}
              contextId={contextId}
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
              testId={`${testId}-d3`}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

TopDestinationsChart.propTypes = {
  tabs: PropTypes.array,
  testId: PropTypes.string,
  onChangeTab: PropTypes.func,
  onLinkClick: PropTypes.func,
  profileType: PropTypes.string,
  commodityName: PropTypes.string,
  contextId: PropTypes.number.isRequired,
  verb: PropTypes.string.isRequired,
  lines: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  nodeName: PropTypes.string,
  includedYears: PropTypes.array.isRequired
};

export default TopDestinationsChart;
