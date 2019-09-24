import React, { useReducer, useEffect } from 'react';
import immer from 'immer';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from 'react-components/shared/tabs';

import './timeline.scss';
import Text from 'react-components/shared/text/text.component';
import _range from 'lodash/range';

function initTimelineState(selectedYears) {
  return {
    init: selectedYears.length > 0,
    hovered: null,
    prevStart: null,
    prevEnd: null,
    prevRange: null,
    range: selectedYears[0] !== selectedYears[1],
    start: selectedYears[0] || null,
    end: selectedYears[1] || null
  };
}

function rangeStateMachine(newRange, state) {
  if (newRange) {
    if (state.prevRange === null) {
      return 'firstSingleToRangeSwitch';
    }
    if (state.prevRange) {
      return 'singleToRangeSwitchWithSavedRange';
    }
    if (!state.prevRange) {
      return 'singleToRangeSwitchWithoutSavedRange';
    }
  }

  if (!newRange) {
    if (state.prevRange === null) {
      return 'firstRangeToSingleSwitch';
    }
    if (!state.prevRange) {
      return 'rangeToSingleSwitchWithSavedSingle';
    }
    if (state.prevRange) {
      return 'rangeToSingleSwitchWithoutSavedSingle';
    }
  }

  throw new Error('Unexpected state');
}

function timelineReducer(state, action) {
  switch (action.type) {
    case 'toggleRange': {
      return immer(state, draft => {
        const newRange = action.payload;
        const status = rangeStateMachine(newRange, state);
        draft.range = newRange;

        if (status === 'firstSingleToRangeSwitch' || status === 'firstRangeToSingleSwitch') {
          draft.prevStart = state.start;
          draft.prevEnd = state.end;
          draft.start = null;
          draft.end = null;
          draft.prevRange = state.range;
        }

        if (
          status === 'singleToRangeSwitchWithSavedRange' ||
          status === 'rangeToSingleSwitchWithSavedSingle'
        ) {
          draft.start = state.prevStart;
          draft.end = state.prevEnd;
        }
        if (
          status === 'singleToRangeSwitchWithoutSavedRange' ||
          status === 'rangeToSingleSwitchWithoutSavedSingle'
        ) {
          draft.start = null;
          draft.end = null;
        }
      });
    }
    case 'select': {
      return immer(state, draft => {
        const year = action.payload;
        if (state.range) {
          if (state.end) {
            draft.end = null;
            draft.start = year;
          } else {
            draft.start = Math.min(state.start, year);
            draft.end = Math.max(state.start, year);
          }
        } else {
          draft.start = year;
          draft.end = year;
        }

        draft.prevStart = state.start;
        draft.prevEnd = state.end;
        draft.prevRange = null;
      });
    }
    case 'hover': {
      return immer(state, draft => {
        draft.hovered = action.payload;
      });
    }
    case 'reset': {
      return initTimelineState(action.payload);
    }
    case 'clear': {
      return immer(state, draft => {
        draft.start = state.prevStart;
        draft.end = state.prevEnd;
      });
    }
    default: {
      throw new Error('Missing action type');
    }
  }
}

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
    if (!state.end) {
      window.addEventListener('keydown', onClickEscape);
    }

    return () => {
      window.removeEventListener('keydown', onClickEscape);
    };
  }, [state.end, dispatch]);
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
      const [startYear, endYear] = [
        state.start || state.hovered,
        state.end || state.hovered
      ].sort();
      const classes = [];

      if (_range(startYear, (endYear || startYear) + 1).includes(year)) {
        classes.push('-active');
      }
      if (year === startYear) {
        classes.push('-start');
      }
      if (year === endYear && state.end) {
        classes.push('-end');
      }

      return classes.join(' ');
    }

    return (year === state.start || year === state.end) && '-start';
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
                onMouseOver={() => dispatch({ type: 'hover', payload: year })}
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
