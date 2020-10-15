import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from 'react-components/shared/tabs';
import Text from 'react-components/shared/text/text.component';
import _range from 'lodash/range';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';

import { translateText } from 'utils/transifex';

import {
  useTimelineReducer,
  useSelectedYearsPropsState,
  useUpdateSelectedYears,
  useEscapeClearEvent,
  useSlider
} from './timeline.hooks';

import './timeline.scss';

function getClassName(year, state) {
  if (state.range) {
    const classes = [];

    if (state.start && state.end) {
      if (year > state.start && year < state.end) {
        classes.push('-active');
      } else if (year === state.start) {
        classes.push('-start');
      } else if (year === state.end) {
        classes.push('-end');
      }
    } else if (state.start) {
      if (state.start === year) {
        classes.push('-start');
      } else {
        const [startYear, endYear] = [state.start, state.hovered].sort();
        if (_range(startYear, (endYear || startYear) + 1).includes(year)) {
          classes.push('-active');
        }
      }
    } else if (year === state.hovered) {
      classes.push('-active');
    }
    return classes.join(' ');
  }

  if (year === state.start && year === state.end) {
    return '-start';
  }
  if (year === state.hovered) {
    return '-active';
  }

  return '';
}

function Timeline(props) {
  const { years, subNationalYears, showBackground, visibleTabs, disabled } = props;
  const [state, dispatch] = useTimelineReducer(props);
  useSelectedYearsPropsState(props, state, dispatch);
  useUpdateSelectedYears(props, state);
  useEscapeClearEvent(state, dispatch);
  const {
    refs,
    hasNextPage,
    hasPrevPage,
    transform,
    onNext,
    onPrevious,
    sizes,
    MARGIN_BETWEEN_ITEMS,
    rangeOutOfBounds
  } = useSlider(props);

  const tabs = [
    { label: 'year', payload: false, type: 'toggleRange' },
    { label: 'range', payload: true, type: 'toggleRange' }
  ].filter(tab => visibleTabs.includes(tab.label));
  const showPlaceholder = state.start && state.end && state.range && !disabled && rangeOutOfBounds;

  return (
    <div className={cx('c-timeline', { '-show-background': showBackground })}>
      <Tabs
        tabs={tabs}
        margin={null}
        disabled={disabled}
        getTabId={t => t.payload}
        itemTabRenderer={t => t.label}
        onSelectTab={item => dispatch(item)}
        selectedTab={state.range}
      />
      <div
        ref={refs.container}
        className={cx('timeline-container', {
          '-button-left': hasPrevPage,
          '-button-right': hasNextPage
        })}
        onMouseEnter={() => dispatch({ type: 'togglePlaceholder', payload: true })}
        onMouseLeave={() => dispatch({ type: 'togglePlaceholder', payload: false })}
      >
        {showPlaceholder && (
          <div
            style={{ width: sizes.container - MARGIN_BETWEEN_ITEMS }}
            className={cx('timeline-range-placeholder', { '-hidden': state.hoverPlaceholder })}
          >
            <div className="timeline-placeholder-year-item">
              <Text as="span" weight="bold" color="white">
                {state.start}
              </Text>
            </div>
            <div className="timeline-placeholder-text">
              <Text as="span" weight="bold" color="gray" transform="uppercase" variant="mono">
                Change selected years
              </Text>
            </div>
            <div className="timeline-placeholder-year-item">
              <Text as="span" weight="bold" color="white">
                {state.end}
              </Text>
            </div>
          </div>
        )}
        <button
          className={cx('timeline-page-button', '-next', {
            '-visible': hasNextPage && (!showPlaceholder || state.hoverPlaceholder)
          })}
          onClick={onNext}
        />
        <button
          className={cx('timeline-page-button', '-prev', {
            '-visible': hasPrevPage && (!showPlaceholder || state.hoverPlaceholder)
          })}
          onClick={onPrevious}
        />
        <ul ref={refs.contentList} className="timeline-years-list" style={{ transform }}>
          {years.map((year, i) => {
            const isActive = year === state.start || year === state.end;
            const statusClassName = getClassName(year, state);
            const isSubNational = subNationalYears.indexOf(year) > -1;
            return (
              <li
                ref={i === 0 ? refs.item : undefined}
                key={year}
                className={cx({
                  'timeline-year-item': true,
                  '-sub-national': isSubNational,
                  [statusClassName]: true
                })}
              >
                <button
                  disabled={disabled || (!state.range && isActive)}
                  className="timeline-year-button"
                  onMouseLeave={() => dispatch({ type: 'hover', payload: null })}
                  onMouseEnter={() => dispatch({ type: 'hover', payload: year })}
                  onClick={() => dispatch({ type: 'select', payload: year })}
                  data-test={`timeline-year-button-${year}`}
                >
                  {!isSubNational && <Tooltip
                    showInfoIcon={false}
                    text={translateText('This data is currently only available at a national scale.')}
                    className="size-sm"
                  >
                    <Text as="span" weight="bold" color={statusClassName ? 'white' : 'grey'}>
                      {year}
                    </Text>
                  </Tooltip>}
                  {isSubNational && (
                    <Text as="span" weight="bold" color={statusClassName ? 'white' : 'grey'}>
                      {year}
                    </Text>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Timeline.defaultProps = {
  showBackground: true,
  visibleTabs: ['year', 'range']
};

Timeline.propTypes = {
  visibleTabs: PropTypes.array,
  showBackground: PropTypes.bool,
  years: PropTypes.array.isRequired,
  subNationalYears: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  selectYears: PropTypes.func.isRequired, // eslint-disable-line
  selectedYears: PropTypes.array.isRequired // eslint-disable-line
};

export default Timeline;
