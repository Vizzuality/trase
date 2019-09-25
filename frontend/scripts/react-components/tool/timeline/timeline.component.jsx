import React, { useReducer, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tabs from 'react-components/shared/tabs';
import Text from 'react-components/shared/text/text.component';
import _range from 'lodash/range';
import timelineReducer, { initTimelineState } from './timeline.reducer';

import './timeline.scss';

function useSelectedYearsPropsState(props, state, dispatch) {
  useEffect(() => {
    if (props.selectedYears.length > 0) {
      dispatch({ type: 'reset', payload: props.selectedYears });
    }
  }, [props.selectedYears, dispatch]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.start, state.end]);
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

function useSlider({ years }) {
  const [page, setPage] = useState(0);
  const container = useRef(null);
  const contentList = useRef(null);
  const item = useRef(null);
  const [pageSize, setPageSize] = useState(0);
  const [itemSize, setItemSize] = useState(0);

  useEffect(() => {
    if (container.current) {
      if (contentList.current) {
        const listBounds = contentList.current.getBoundingClientRect();
        if (item.current) {
          const itemBounds = item.current.getBoundingClientRect();
          const marginBetweenItems = 12;
          setItemSize(Math.ceil(itemBounds.width + marginBetweenItems));
          setPageSize(listBounds.width);
          setPage(0);
        }
      }
    }
  }, [years]);

  const numPages = Math.round(pageSize / (itemSize * 3)) - 1;

  return {
    refs: {
      container,
      contentList,
      item
    },
    page,
    pageSize,
    itemSize,
    numPages,
    onPrevious: () => setPage(p => p - 1),
    onNext: () => setPage(p => p + 1)
  };
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
  const { page, refs, pageSize, itemSize, numPages, onNext, onPrevious } = useSlider(props);

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
    { label: 'year', payload: false, type: 'toggleRange' }
  ];

  const translateYearList = (() => {
    const jump = itemSize * 3;
    return `translate3d(${-page * jump}px, 0, 0)`;
  })();

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
          '-button-left': page > 0,
          '-button-right': page < numPages
        })}
      >
        <button
          className={cx('timeline-page-button', '-next', { '-visible': page < numPages })}
          onClick={onNext}
        />
        <button
          className={cx('timeline-page-button', '-prev', { '-visible': page > 0 })}
          onClick={onPrevious}
        />
        <ul
          ref={refs.contentList}
          className="timeline-years-list"
          style={{
            transform: translateYearList
          }}
        >
          {years.map((year, i) => {
            const isActive = year === state.start || year === state.end;
            const statusClassName = getClassName(year);
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
  selectedYears: PropTypes.array.isRequired
};

export default Timeline;
