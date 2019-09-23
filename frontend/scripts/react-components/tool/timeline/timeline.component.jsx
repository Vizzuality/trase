import React, { useReducer, useEffect } from 'react';
import immer from 'immer';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from 'react-components/shared/tabs';

import './timeline.scss';

function initTimelineState(selectedYears) {
  return {
    range: selectedYears[0] !== selectedYears[1],
    start: selectedYears[0] || null,
    end: selectedYears[1] || null
  };
}

function timelineReducer(state, action) {
  switch (action.type) {
    case 'SET_RANGE_MODE': {
      return immer(state, draft => {
        draft.range = action.payload;
      });
    }
    case 'SELECT_YEAR': {
      return immer(state, draft => {
        const year = action.payload;
        if (state.range) {
          if (state.end) {
            draft.end = null;
            draft.start = year;
          } else if (year < state.start) {
            draft.end = state.start;
            draft.start = year;
          } else {
            draft.end = year;
          }
        } else {
          draft.start = year;
          draft.end = year;
        }
      });
    }
    case 'RESET': {
      return initTimelineState(action.payload);
    }
    default: {
      throw new Error('Missing action type');
    }
  }
}

function Timeline(props) {
  const { years, selectedYears, selectYears } = props;
  const [state, dispatch] = useReducer(
    timelineReducer,
    initTimelineState(selectedYears),
    initTimelineState
  );

  useEffect(() => {
    if (!state.start && !state.end && selectedYears.length > 0) {
      dispatch({ type: 'RESET', payload: selectedYears });
    }
  }, [selectedYears, state.end, state.start]);

  useEffect(() => {
    if (
      state.start &&
      state.end &&
      (state.start !== selectedYears[0] || state.end !== selectedYears[1])
    ) {
      selectYears([state.start, state.end]);
    }
  }, [state.start, state.end, selectedYears, selectYears]);

  const tabs = [
    { label: 'range', payload: true, type: 'SET_RANGE_MODE' },
    { label: 'single', payload: false, type: 'SET_RANGE_MODE' }
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
        {years.map(year => (
          <li
            className={cx('timeline-year-item', {
              '-active': year === state.start || year === state.end
            })}
          >
            <button
              disabled={state.range && (year === state.start || year === state.end)}
              className="timeline-year-button"
              onClick={() => dispatch({ type: 'SELECT_YEAR', payload: year })}
            >
              {year}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Timeline.propTypes = {
  years: PropTypes.array,
  selectYears: PropTypes.func,
  selectedYears: PropTypes.array
};

export default Timeline;
