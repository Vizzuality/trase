import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from 'react-components/shared/tabs';
import Text from 'react-components/shared/text/text.component';
import _range from 'lodash/range';
import timelineReducer, { initTimelineState } from './timeline.reducer';

import './timeline.scss';

function useSelectedYearsPropsState(props, state, dispatch) {
  useEffect(() => {
    if (!state.init && props.selectedYears.length > 0) {
      dispatch({ type: 'reset', payload: props.selectedYears });
    }
  }, [props.selectedYears, state.end, state.start, dispatch, state.init]);
}

function useUpdateSelectedYears(props, state) {
  const { selectYears, selectedYears } = props;
  useEffect(() => {
    if (
      state.start &&
      state.end &&
      (state.start !== selectedYears[0] || state.end !== selectedYears[1])
    ) {
      selectYears([state.start, state.end]);
    }
  }, [state.start, state.end, selectedYears, selectYears]);
}

function useEscapeClearEvent(state, dispatch) {
  useEffect(() => {
    const onClickEscape = e => {
      if (e.key === 'Escape') {
        dispatch({ type: 'clear' });
      }
    };
    if (!state.end && state.range) {
      window.addEventListener('keydown', onClickEscape);
    }

    return () => {
      window.removeEventListener('keydown', onClickEscape);
    };
  }, [state.end, dispatch, state.range]);
}

function Timeline(props) {
  const { years, selectedYears } = props;
  const [state, dispatch] = useReducer(
    timelineReducer,
    initTimelineState(selectedYears),
    initTimelineState
  );

  useSelectedYearsPropsState(props, state, dispatch);
  useUpdateSelectedYears(props, state);
  useEscapeClearEvent(state, dispatch);

  function getClassName(year) {
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

  const tabs = [
    { label: 'range', payload: true, type: 'toggleRange' },
    { label: 'single', payload: false, type: 'toggleRange' }
  ];

  return (
    <div className="c-timeline">
      <Tabs
        tabs={tabs}
        onSelectTab={item => dispatch(item)}
        selectedTab={state.range}
        getTabId={t => t.payload}
        itemTabRenderer={t => t.label}
      />
      <ul className="timeline-years-list">
        {years.map(year => {
          const isActive = year === state.start || year === state.end;
          const statusClassName = getClassName(year);
          return (
            <li key={year} className={cx('timeline-year-item', statusClassName)}>
              <button
                disabled={!state.range && state.end && isActive}
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
  );
}

Timeline.propTypes = {
  years: PropTypes.array.isRequired,
  selectYears: PropTypes.func.isRequired, // eslint-disable-line
  selectedYears: PropTypes.array.isRequired
};

export default Timeline;
