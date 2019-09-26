import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from 'react-components/shared/tabs';
import Text from 'react-components/shared/text/text.component';
import _range from 'lodash/range';
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
  const { years } = props;

  const [state, dispatch] = useTimelineReducer(props);
  useSelectedYearsPropsState(props, state, dispatch);
  useUpdateSelectedYears(props, state);
  useEscapeClearEvent(state, dispatch);
  const { refs, hasNextPage, hasPrevPage, transform, onNext, onPrevious } = useSlider(props);

  const tabs = [
    { label: 'range', payload: true, type: 'toggleRange' },
    { label: 'year', payload: false, type: 'toggleRange' }
  ];

  return (
    <div className="c-timeline">
      <Tabs
        tabs={tabs}
        margin={null}
        onSelectTab={item => dispatch(item)}
        selectedTab={state.range}
        getTabId={t => t.payload}
        itemTabRenderer={t => t.label}
      />
      <div
        ref={refs.container}
        className={cx('timeline-container', {
          '-button-left': hasPrevPage,
          '-button-right': hasNextPage
        })}
      >
        <button
          className={cx('timeline-page-button', '-next', { '-visible': hasNextPage })}
          onClick={onNext}
        />
        <button
          className={cx('timeline-page-button', '-prev', { '-visible': hasPrevPage })}
          onClick={onPrevious}
        />
        <ul ref={refs.contentList} className="timeline-years-list" style={{ transform }}>
          {years.map((year, i) => {
            const isActive = year === state.start || year === state.end;
            const statusClassName = getClassName(year, state);
            return (
              <li
                ref={i === 0 ? refs.item : undefined}
                key={year}
                className={cx('timeline-year-item', statusClassName)}
              >
                <button
                  disabled={isActive}
                  className="timeline-year-button"
                  onMouseLeave={() => dispatch({ type: 'hover', payload: null })}
                  onMouseEnter={() => dispatch({ type: 'hover', payload: year })}
                  onClick={() => dispatch({ type: 'select', payload: year })}
                  data-test={`timeline-year-button-${year}`}
                >
                  <Text as="span" weight="bold" color={statusClassName ? 'white' : 'grey'}>
                    {year}
                  </Text>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Timeline.propTypes = {
  years: PropTypes.array.isRequired,
  selectYears: PropTypes.func.isRequired, // eslint-disable-line
  selectedYears: PropTypes.array.isRequired // eslint-disable-line
};

export default Timeline;
