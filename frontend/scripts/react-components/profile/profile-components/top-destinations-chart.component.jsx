import React from 'react';
import PropTypes from 'prop-types';
import Line from 'react-components/profile/profile-components/line/line.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import formatValue from 'utils/formatValue';
import DropdownTabSwitcher from 'react-components/profile/profile-components/dropdown-tab-switcher/dropdown-tab-switcher.component';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import Heading from 'react-components/shared/heading/heading.component';
import ProfileTitle from 'react-components/profile/profile-components/profile-title.component';
import isMobile from 'utils/isMobile';

const TranslatedLine = withTranslation(Line);

class TopDestinationsChart extends React.PureComponent {
  state = { tooltipConfig: null };

  onMouseMove = (location, x, y) => {
    const { summary } = this.props;
    const text = `${
      summary.nodeName
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
    right: 10,
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
    const { summary, year, title, commodityName } = this.props;
    return (
      <>
        <ProfileTitle
          template={title}
          summary={summary}
          year={year}
          commodityName={commodityName}
        />
        :
      </>
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
    const heightStyle = isMobile() ? { minHeigh: height } : { height };
    return (
      <React.Fragment>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <div className="top-destinations-chart-container">
          <div>
            {type === 'actor_top_countries' ? (
              <Heading variant="mono" weight="bold" as="h3" size="md" data-test={`${testId}-title`}>
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
          <div className="top-destinations-chart-wrapper" style={{ ...heightStyle, width: '100%' }}>
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
  nodeName: PropTypes.string,
  onLinkClick: PropTypes.func,
  profileType: PropTypes.string,
  lines: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  summary: PropTypes.object.isRequired,
  contextId: PropTypes.number.isRequired,
  includedYears: PropTypes.array.isRequired,
  commodityName: PropTypes.string.isRequired
};

export default TopDestinationsChart;
