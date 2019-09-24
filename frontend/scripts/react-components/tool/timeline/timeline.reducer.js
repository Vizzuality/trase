import immer from 'immer';

export function initTimelineState(selectedYears) {
  return {
    init: selectedYears.length > 0,
    hovered: null,
    prevStart: null,
    prevEnd: null,
    prevRange: null,
    range: selectedYears.length > 0 ? selectedYears[0] !== selectedYears[1] : null,
    start: selectedYears[0] || null,
    end: selectedYears[1] || null
  };
}

export function toggleStateMachine(newRange, state) {
  if (newRange) {
    if (state.prevRange === null) {
      return 'firstSingleToRangeSwitch';
    }
    if (state.prevRange === true) {
      return 'singleToRangeSwitchWithSavedRange';
    }
    if (state.prevRange === false) {
      return 'singleToRangeSwitchWithoutSavedRange';
    }
  }

  if (!newRange) {
    if (state.prevRange === null) {
      return 'firstRangeToSingleSwitch';
    }
    if (state.prevRange === false) {
      return 'rangeToSingleSwitchWithSavedSingle';
    }
    if (state.prevRange === true) {
      return 'rangeToSingleSwitchWithoutSavedSingle';
    }
  }

  throw new Error('Unexpected state');
}

export function selectStateMachine(state) {
  if (state.range) {
    if ((state.start && state.end) || (state.start === null && state.end === null)) {
      return 'initRange';
    }
    if (state.start && state.end === null) {
      return 'completeRange';
    }
  }
  if (state.range === false) {
    return 'completeSingle';
  }

  throw new Error('Unexpected state');
}

export default function timelineReducer(state, action) {
  switch (action.type) {
    case 'toggleRange': {
      return immer(state, draft => {
        const newRange = action.payload;
        const status = toggleStateMachine(newRange, state);
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
        const status = selectStateMachine(state);
        const year = action.payload;
        if (status === 'initRange') {
          draft.end = null;
          draft.start = year;
        }
        if (status === 'completeRange') {
          draft.start = Math.min(state.start, year);
          draft.end = Math.max(state.start, year);
        }
        if (status === 'completeSingle') {
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
        if (state.prevRange !== false) {
          draft.start = state.prevStart;
          draft.end = state.prevEnd;
        } else {
          draft.start = null;
          draft.end = null;
        }
      });
    }
    default: {
      throw new Error('Missing action type');
    }
  }
}
