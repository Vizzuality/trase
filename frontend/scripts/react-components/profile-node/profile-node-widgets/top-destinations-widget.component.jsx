import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import {
  GET_ACTOR_TOP_COUNTRIES,
  GET_NODE_SUMMARY_URL,
  GET_ACTOR_TOP_SOURCES
} from 'utils/getURLFromParams';
import cx from 'classnames';
import capitalize from 'lodash/capitalize';
import Line from 'react-components/profiles/line.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import Tooltip from 'components/shared/info-tooltip.component';
import formatValue from 'utils/formatValue';
import DropdownTabSwitcher from 'react-components/profiles/dropdown-tab-switcher.component';

const TranslatedLine = withTranslation(Line);

class TopDestinationsWidget extends React.PureComponent {
  tabs = ['municipality', 'biome', 'state'];

  state = {
    activeTab: 'municipality'
  };

  getTitle(name, column) {
    const { type, year } = this.props;
    const noun = type === 'countries' ? 'destination countries' : 'sourcing regions';
    const verb = column === 'EXPORTER' ? 'exported' : 'imported';
    return (
      <React.Fragment>
        Top {noun} of soy {verb} by <span className="notranslate">{capitalize(name)}</span> in{' '}
        <span className="notranslate">{year}</span>
      </React.Fragment>
    );
  }

  getTooltipRef = ref => {
    this.tooltip = new Tooltip(ref);
  };

  getLineProps(data) {
    const { type } = this.props;
    const { activeTab } = this.state;
    const linesData = type === 'countries' ? data : data[activeTab];
    const { includedYears } = data;
    const { lines, style, unit, profileType } = linesData;
    return { includedYears, lines, style, unit, profileType };
  }

  buildLineChartSettings = nodeName => ({
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
  });

  updateTab = index => this.setState({ activeTab: this.tabs[index] });

  render() {
    const { printMode, year, nodeId, contextId, type, className } = this.props;
    const mainQuery = type === 'countries' ? GET_ACTOR_TOP_COUNTRIES : GET_ACTOR_TOP_SOURCES;
    const params = { node_id: nodeId, context_id: contextId };
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[{ ...params, year }, { ...params, profile_type: 'actor' }]}
      >
        {({ data, loading }) => {
          if (loading) return null;
          const { includedYears, lines, unit, profileType, style } = this.getLineProps(
            data[mainQuery]
          );
          const { nodeName } = data[GET_NODE_SUMMARY_URL];
          return (
            <section className={className}>
              <div className="c-info-tooltip is-hidden" ref={this.getTooltipRef} />
              <div className="row">
                <div
                  className={cx('small-12', 'columns', {
                    'medium-6': printMode,
                    'medium-8': !printMode
                  })}
                >
                  <div className="row column">
                    {type === 'countries' ? (
                      <h3 className="title -small">{this.getTitle(nodeName)}</h3>
                    ) : (
                      <DropdownTabSwitcher
                        title={this.getTitle(nodeName)}
                        items={this.tabs}
                        onSelectedIndexChange={this.updateTab}
                      />
                    )}
                  </div>
                  <div className="c-line">
                    <TranslatedLine
                      profileType={profileType}
                      unit={unit}
                      lines={lines.slice(0, 5)}
                      style={style}
                      xValues={includedYears}
                      settings={this.buildLineChartSettings(nodeName)}
                      useBottomLegend
                      year={year}
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

TopDestinationsWidget.propTypes = {
  printMode: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default TopDestinationsWidget;
